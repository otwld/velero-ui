import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import type { Router } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';

export const useAuth = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const router: Router = useRouter();
  const route = useRoute();

  const { execute, isLoading, data, error } = useAxios(axiosInstance);

  const login = async (provider: string) => {
    try {
      await execute(`${ApiRoutes.AUTH}/${provider}`, {
        method: 'get',
        params: route.query,
      });

      if (data?.value?.access_token) {
        localStorage.setItem('access_token', data?.value.access_token);
        await router.push('/');
      }
    } catch (e) {
      await router.push('/?state=error&reason=sso');
      console.error(e);
    }
  };

  return { login, isLoading, error };
};
