import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router';
import { User, UserManager } from 'oidc-client-ts';
import { inject } from 'vue';
import { Pages } from './constants.utils';

const guard: NavigationGuardWithThis<string> = async (
  to: RouteLocationNormalized
): Promise<RouteLocationRaw> => {
  const oidcClient: UserManager = inject('oidcClient') as UserManager;

  try {
    const user: User = await oidcClient.getUser();

    if (!user && to.name !== Pages.LOGIN.name) {
      return {
        name: Pages.LOGIN.name,
        query: {
          state: 'error',
          reason: 'unauthorized',
        },
      };
    }

    if (user && user.expired) {
      await oidcClient.removeUser();
      return {
        name: Pages.LOGIN.name,
        query: {
          state: 'error',
          reason: 'inactivity',
        },
      };
    }

    if (user && to.name === 'Login') {
      return { name: Pages.HOME.name };
    }
  } catch (e) {
    console.error(e);
    await oidcClient.removeUser();
    return { name: Pages.LOGIN.name };
  }
};
export default guard;
