import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import {
  Action,
  CreateBackupTypeEnum,
  JwtPayload,
} from '@velero-ui/shared-types';
import appConfig from '../config/app.config';
import basicAuthConfig from '../config/basic-auth.config';
import { CaslAbilityFactory } from './shared/modules/casl/casl-ability.factory';
import { AppLogger } from './shared/modules/logger/logger.service';
import { CreateBackupDto } from './shared/dto/backup.dto';
import { CreateScheduleDto, EditScheduleDto } from './shared/dto/schedule.dto';
import { CreateRestoreDto } from './shared/dto/restore.dto';
import { validationPipe } from './shared/validation.pipe';
import { BackupController } from './modules/backup/backup.controller';
import { CHECK_POLICIES_KEY } from './shared/decorators/check-policies.decorator';

jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  readFileSync: jest.fn(),
}));
jest.mock('./modules/backup/backup-snapshots.service', () => ({
  BackupSnapshotsService: class {},
}));
jest.mock('./modules/backup/backup.service', () => ({
  BackupService: class {},
}));
jest.mock('./modules/download-request/download-request.service', () => ({
  DownloadRequestService: class {},
}));
jest.mock('./modules/k8s-custom-object/k8s-custom-object.service', () => ({
  K8sCustomObjectService: class {},
}));

describe('security boundaries', () => {
  const environment = { ...process.env };
  afterEach(() => {
    process.env = { ...environment };
    jest.clearAllMocks();
  });

  it.each([
    '',
    'this is the secret pass phrase',
    'this is not a secret passphrase',
  ])('rejects missing or public signing keys: %s', (secret) => {
    process.env.AUTH_SECRET_PASSPHRASE = secret;
    expect(appConfig).toThrow('AUTH_SECRET_PASSPHRASE');
  });

  it('accepts a random signing key and rejects tokens signed with the former default', () => {
    process.env.AUTH_SECRET_PASSPHRASE = randomBytes(32).toString('hex');
    const jwt = new JwtService({ secret: appConfig().secret });
    const forged = new JwtService({
      secret: 'this is not a secret passphrase',
    }).sign({ permissions: [{ action: 'manage', subject: 'all' }] });
    expect(() => jwt.verify(forged)).toThrow();
    expect(jwt.verify(jwt.sign({ sub: 'user' })).sub).toBe('user');
  });

  it('requires explicitly configured local credentials', () => {
    process.env.BASIC_AUTH_ENABLED = 'true';
    delete process.env.BASIC_AUTH_USERNAME;
    delete process.env.BASIC_AUTH_PASSWORD;
    expect(basicAuthConfig).toThrow('BASIC_AUTH_USERNAME');
    process.env.BASIC_AUTH_USERNAME = 'admin';
    process.env.BASIC_AUTH_PASSWORD = 'admin';
    expect(basicAuthConfig).toThrow('BASIC_AUTH_PASSWORD');
    process.env.BASIC_AUTH_PASSWORD = randomBytes(24).toString('hex');
    expect(basicAuthConfig().enabled).toBe(true);
    process.env.BASIC_AUTH_ENABLED = 'false';
    delete process.env.BASIC_AUTH_PASSWORD;
    expect(basicAuthConfig().enabled).toBe(false);
  });

  const factory = (policyPath?: string) =>
    new CaslAbilityFactory(new ConfigService({ app: { policyPath } }), {
      warn: jest.fn(),
    } as unknown as AppLogger);

  it('grants no federated permissions without policies, including an empty file', async () => {
    const absent = factory();
    await absent.onModuleInit();
    expect(absent.getPermissionsForUser('anyone')).toEqual([]);
    jest.mocked(readFileSync).mockReturnValue('# no permissions\n');
    const empty = factory('/policies.csv');
    await empty.onModuleInit();
    expect(empty.getPermissionsForUser('anyone')).toEqual([]);
  });

  it('fails startup on unreadable or invalid policies', async () => {
    jest.mocked(readFileSync).mockImplementation(() => {
      throw new Error('unreadable');
    });
    await expect(factory('/missing.csv').onModuleInit()).rejects.toThrow(
      'unreadable'
    );
    jest
      .mocked(readFileSync)
      .mockReturnValue('u,alice,manage,all\nu,,read,all');
    await expect(factory('/policies.csv').onModuleInit()).rejects.toThrow(
      'Invalid policy'
    );
  });

  it('preserves explicit user, group and wildcard permissions', async () => {
    jest
      .mocked(readFileSync)
      .mockReturnValue(
        'u,alice,download,backups\ng,ops,manage,all\nu,*,read,backups'
      );
    const policies = factory('/policies.csv');
    await policies.onModuleInit();
    const ability = (user: string, groups: string[] = []) =>
      policies.createForUser({
        permissions: policies.getPermissionsForUser(user, groups),
      } as JwtPayload);
    expect(ability('unknown').can(Action.Manage, 'all')).toBe(false);
    expect(ability('unknown').can(Action.Read, 'backups')).toBe(true);
    expect(ability('alice').can(Action.Download, 'backups')).toBe(true);
    expect(ability('bob', ['ops']).can(Action.Manage, 'all')).toBe(true);
  });

  const spec = {
    ttl: '1h',
    storageLocation: 'default',
    csiSnapshotTimeout: '10m',
    datamover: 'velero',
  };
  const hooks = {
    resources: [{ name: 'injected', pre: [{ exec: { command: ['true'] } }] }],
  };
  it.each([
    [
      CreateBackupDto,
      {
        name: 'test',
        type: CreateBackupTypeEnum.FROM_SCRATCH,
        spec: { ...spec, hooks },
      },
    ],
    [
      CreateScheduleDto,
      {
        name: 'test',
        spec: { schedule: '0 1 * * *', template: { ...spec, hooks } },
      },
    ],
    [
      EditScheduleDto,
      { spec: { schedule: '0 1 * * *', template: { ...spec, hooks } } },
    ],
    [CreateRestoreDto, { name: 'test', spec: { backupName: 'backup', hooks } }],
  ])('rejects undeclared hooks for %p', async (metatype, value) => {
    await expect(
      validationPipe.transform(value, { type: 'body', metatype })
    ).rejects.toThrow();
  });

  it('keeps supported backup options and arbitrary label keys', async () => {
    const body = {
      name: 'test',
      type: CreateBackupTypeEnum.FROM_SCRATCH,
      labels: { 'example.com/team': 'ops' },
      spec,
    };
    await expect(
      validationPipe.transform(body, {
        type: 'body',
        metatype: CreateBackupDto,
      })
    ).resolves.toEqual(body);
  });

  it.each(['download', 'downloadByName'])(
    'requires download permission for %s',
    (method) => {
      const policies = factory();
      const readOnly = policies.createForUser({
        permissions: [{ action: Action.Read, subject: 'backups' }],
      } as JwtPayload);
      const downloader = policies.createForUser({
        permissions: [{ action: Action.Download, subject: 'backups' }],
      } as JwtPayload);
      const handlers = Reflect.getMetadata(
        CHECK_POLICIES_KEY,
        BackupController.prototype[method]
      );
      expect(handlers.length).toBeGreaterThan(0);
      expect(handlers.every((handler) => handler(readOnly))).toBe(false);
      expect(handlers.every((handler) => handler(downloader))).toBe(true);
    }
  );
});
