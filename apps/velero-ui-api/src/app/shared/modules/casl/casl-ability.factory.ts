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

    this.groupPermissions.clear();
    this.userPermissions.clear();
    if (!filePath) {
      this.logger.warn(
        'No policy file configured; federated users have no permissions',
        CaslAbilityFactory.name
      );
      return;
    }

    const lines = readFileSync(filePath, 'utf-8').split('\n');
    for (const [index, line] of lines.entries()) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const fields = line.split(',').map((value) => value.trim());
      const [type, entity, action, subject] = fields;
      if (
        fields.length !== 4 ||
        !entity ||
        (type !== PolicyType.Group && type !== PolicyType.User) ||
        !isValidPermission(action, subject)
      ) {
        throw new Error(`Invalid policy at line ${index + 1}`);
      }
      const permissions =
        type === PolicyType.Group
          ? this.groupPermissions
          : this.userPermissions;
      const existing = permissions.get(entity) || [];
      existing.push({ action: action as Action, subject: subject as Subjects });
      permissions.set(entity, existing);
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
