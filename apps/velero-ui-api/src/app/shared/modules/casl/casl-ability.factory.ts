import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import {
  Action,
  JwtPayload,
  PolicyType,
  Subjects,
  UserPermission,
} from '@velero-ui/shared-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { readFileSync } from 'node:fs';
import { isValidPermission } from '@velero-ui-api/shared/utils/policy.utils';

export type AppAbility = PureAbility<[Action, Subjects]>;
export const AppAbilityClass = PureAbility as AbilityClass<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  private groupPermissions = new Map<string, UserPermission[]>();
  private userPermissions = new Map<string, UserPermission[]>();

  constructor(
    private readonly configService: ConfigService,
    private logger: AppLogger
  ) {}

  public async onModuleInit() {
    const filePath = this.configService.get('app.policyPath');

    try {
      if (!filePath) {
        throw new Error('No policy.csv path specified, skipping!');
      }
      const raw = readFileSync(filePath, 'utf-8');
      let lineRow = 0;
      const lines: string[] = raw
        .split('\n')
        .map((l: string) => l.trim())
        .filter(Boolean);

      for (const line of lines) {
        lineRow++;
        if (line.startsWith('#')) {
          continue;
        }

        const [type, entity, action, subject] = line
          .split(',')
          .map((s: string) => s.trim());

        if (type === PolicyType.Group && isValidPermission(action, subject)) {
          const perm: UserPermission = {
            subject: subject as Subjects,
            action: action as Action,
          };

          const groupPerms: UserPermission[] =
            this.groupPermissions.get(entity) || [];

          groupPerms.push(perm);

          this.groupPermissions.set(entity, groupPerms);
        } else if (
          type === PolicyType.User &&
          isValidPermission(action, subject)
        ) {
          const perm: UserPermission = {
            subject: subject as Subjects,
            action: action as Action,
          };

          const userPerms: UserPermission[] =
            this.userPermissions.get(entity) || [];

          userPerms.push(perm);

          this.userPermissions.set(entity, userPerms);
        } else {
          this.logger.warn(
            `Unknown policy type "${type},${entity},${action},${subject}" in line "${lineRow}", skipping!`,
            CaslAbilityFactory.name
          );
        }
      }
    } catch (error) {
      this.logger.warn(
        `Unable to read ${filePath} and extract policies, skipping!`,
        CaslAbilityFactory.name
      );
    }

    if (this.groupPermissions.size === 0 && this.userPermissions.size === 0) {
      this.userPermissions.set('*', [
        {
          subject: 'all',
          action: Action.Manage,
        } as UserPermission,
      ]);
    }
  }

  public getPermissionsForUser(
    userId: string,
    groups: string[] = []
  ): UserPermission[] {
    const perms: UserPermission[] = [];

    const userPerms: UserPermission[] = this.userPermissions.get(userId) || [];
    const wildcardPerms: UserPermission[] = [
      ...(this.userPermissions.get('*') || []),
      ...(this.groupPermissions.get('*') || []),
    ];
    perms.push(...userPerms);
    perms.push(...wildcardPerms);

    for (const group of groups) {
      const groupPerms: UserPermission[] =
        this.groupPermissions.get(group) || [];
      perms.push(...groupPerms);
    }

    return perms;
  }

  public createForUser(user: JwtPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(AppAbilityClass);

    if (user.permissions && Array.isArray(user.permissions)) {
      for (const perm of user.permissions) {
        can(perm.action, perm.subject);
      }
    }

    return build({
      detectSubjectType: (item: any) => item?.subjectType || item,
    });
  }
}
