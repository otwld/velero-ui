import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router';
import { User, UserManager } from 'oidc-client-ts';
import { inject } from 'vue';
import { Pages } from './constants.utils';
import { hasExpired } from '@velero-ui-app/utils/jwt.utils';
import type { AppPublicConfig } from '@velero-ui/shared-types';

const guard: NavigationGuardWithThis<string> = async (
  to: RouteLocationNormalized
): Promise<RouteLocationRaw> => {
  const oidcClient: UserManager = inject('oidcClient') as UserManager;
  const { oidc, basicAuth } = inject('config') as AppPublicConfig;

  const accessToken: string = localStorage.getItem('access_token');
  const oidcUser: User = await oidcClient.getUser();

  if (oidc.enabled && oidcUser) {
    if (oidcUser && oidcUser.expired) {
      await oidcClient.removeUser();
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
  } else if (basicAuth.enabled && accessToken) {
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
};
export default guard;
