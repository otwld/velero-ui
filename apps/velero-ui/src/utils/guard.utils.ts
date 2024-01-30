import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router';
import { User, UserManager } from 'oidc-client-ts';
import { inject } from 'vue';

const guard: NavigationGuardWithThis<string> = async (
  to: RouteLocationNormalized
): Promise<RouteLocationRaw> => {
  const oidcClient: UserManager = inject('oidcClient') as UserManager;

  try {
    const user: User = await oidcClient.getUser();

    if (!user && to.name !== 'Login') {
      return { name: 'Login' };
    }

    if (user && user.expired) {
      await oidcClient.removeUser();
      return { name: 'Login' };
    }

    if (user && to.name === 'Login') {
      return { name: 'Home' };
    }
  } catch (e) {
    console.error(e);
    await oidcClient.removeUser();
    return { name: 'Login' };
  }
};
export default guard;
