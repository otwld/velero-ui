import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Action, JwtPayload, Subjects } from '@velero-ui/shared-types';
import { Injectable } from '@nestjs/common';

export type AppAbility = PureAbility<[Action, Subjects]>;
export const AppAbilityClass = PureAbility as AbilityClass<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: JwtPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(AppAbilityClass);

    if (user.permissions && Array.isArray(user.permissions)) {
      for (const perm of user.permissions) {
        if (perm.action === Action.Manage) {
          can(perm.action, 'all');
        } else {
          can(perm.action, perm.subject);
        }
      }
    }

    return build({
      detectSubjectType: (item: any) => item?.subjectType || item,
    });
  }
}
