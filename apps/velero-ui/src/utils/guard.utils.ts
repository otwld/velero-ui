import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router';
import { Pages } from './constants.utils';
import { hasExpired } from '@velero-ui-app/utils/jwt.utils';

const guard: NavigationGuardWithThis<string> = async (
  to: RouteLocationNormalized,
): Promise<RouteLocationRaw> => {
  const accessToken: string = localStorage.getItem('access_token');

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
};
export default guard;
