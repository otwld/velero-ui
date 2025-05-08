import {
  Action, type AppPublicConfig,
  type JwtPayload,
  type Subjects,
  type UserPermission,
} from '@velero-ui/shared-types';
import { getUser } from '@velero-ui-app/utils/jwt.utils';
import { inject } from "vue";

export const canAbility = (
  permissions: UserPermission[] = [],
  action: Action,
  subject: Subjects
): boolean => {
  return permissions.some(
    (p: UserPermission) =>
      (p.action === action && p.subject === subject) ||
      (p.action === action && p.subject === 'all') ||
      (p.action === Action.Manage && p.subject === subject) ||
      (p.action === Action.Manage && p.subject === 'all')
  );
};

export const can = (action: Action, subject: Subjects): boolean => {
  const { noAuthRequired } = inject('config') as AppPublicConfig;

  if (noAuthRequired) {
    return true;
  }

  const accessToken: string = localStorage.getItem('access_token');
  const user: JwtPayload = getUser(accessToken);

  return canAbility(user?.permissions, action, subject);
};
