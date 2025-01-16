import { useAxios } from '@vueuse/integrations/useAxios';
import { inject, type Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { resetSocketIOConnection } from '@velero-ui-app/plugins/socket.plugin';

export const useFormAuth = (username: Ref<string>, password: Ref<string>) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const router: Router = useRouter();

  const { execute, isLoading, data, error } = useAxios(axiosInstance);

  const login = async () => {
    try {
      await execute(`${ApiRoutes.AUTH}/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          username: username.value,
          password: password.value,
        },
      });

      if (data?.value) {
        localStorage.setItem('access_token', data?.value.access_token);
        resetSocketIOConnection();
        await router.push('/');
      }
    } catch (e) {
      await router.push('/?state=error&reason=credentials');
      console.error(e);
    }
  };

  return { login, isLoading, error };
};
