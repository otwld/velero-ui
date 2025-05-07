import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router';
import { Pages } from './constants.utils';
import { getUser, hasExpired } from '@velero-ui-app/utils/jwt.utils';
import { inject } from 'vue';
import {
  Action,
  type AppPublicConfig,
  type JwtPayload,
  type Subjects,
} from '@velero-ui/shared-types';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { canAbility } from '@velero-ui-app/utils/policy.utils';

export const guard: NavigationGuardWithThis<string> = async (
  to: RouteLocationNormalized
): Promise<RouteLocationRaw> => {
  const accessToken: string = localStorage.getItem('access_token');
  const { noAuthRequired } = inject('config') as AppPublicConfig;

  if (noAuthRequired) {
    localStorage.removeItem('access_token');
    if (to.name === Pages.LOGIN.name) {
      return { name: Pages.HOME.name };
    }
  } else {
    if (accessToken) {
      if (hasExpired(accessToken)) {
        localStorage.removeItem('access_token');

        return {
          name: Pages.LOGIN.name,
          query: {
            state: 'error',
            reason: 'inactivity',
          },
        };
      }

      if (to.name === Pages.LOGIN.name) {
        return { name: Pages.HOME.name };
      }
    } else {
      if (!to.path.startsWith(Pages.LOGIN.path)) {
        return {
          name: Pages.LOGIN.name,
          query: {
            state: 'error',
            reason: 'unauthorized',
          },
        };
      }
    }
  }
};

export const resourceGuard = (
  action: Action,
  subject: Subjects
): RouteLocationRaw => {
  const accessToken: string = localStorage.getItem('access_token');

  if (!accessToken) {
    return {
      name: Pages.LOGIN.name,
      query: {
        state: 'error',
        reason: 'unauthorized',
      },
    };
  }

  const user: JwtPayload = getUser(accessToken);
  const can = canAbility(user.permissions, action, subject);

  if (!can) {
    const toastsStore = useToastsStore();

    toastsStore.push('Access denied by policy.', ToastType.ERROR);

    return {
      name: Pages.HOME.name,
    };
  }
};
