import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { resetSocketIOConnection } from '@velero-ui-app/plugins/socket.plugin';
import { useMutation } from '@tanstack/vue-query';

export const useFormAuth = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const router: Router = useRouter();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) =>
      (
        await axiosInstance.post(
          `/auth/login`,
          {
            username: username,
            password: password,
          },
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          }
        )
      ).data,
    onSuccess: async (data) => {
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        resetSocketIOConnection();
        await router.push('/dashboard');
      } else {
        await router.push('/?state=error&reason=credentials');
      }
    },
    onError: async (error) => {
      await router.push('/?state=error&reason=credentials');
      console.error(error);
    },
  });
};
