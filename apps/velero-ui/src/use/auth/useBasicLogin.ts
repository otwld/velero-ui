import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { useUserStore } from '@velero-ui-app/stores/user.store';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';

export const useBasicLogin = (username: Ref<string>, password: Ref<string>) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const router: Router = useRouter();
  const userStore = useUserStore();

  const { execute, isLoading, data, error } = useAxios<any>(axiosInstance);

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
        userStore.login(data?.value.access_token);
        await router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { login, isLoading, error };
};
