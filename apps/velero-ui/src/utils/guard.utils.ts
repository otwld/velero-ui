import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router';
import { Pages } from './constants.utils';
import { hasExpired } from '@velero-ui-app/utils/jwt.utils';
import { inject } from 'vue';
import type { AppPublicConfig } from '@velero-ui/shared-types';

const guard: NavigationGuardWithThis<string> = async (
  to: RouteLocationNormalized,
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
export default guard;
