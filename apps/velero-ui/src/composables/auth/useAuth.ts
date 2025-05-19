import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import type { Router } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { resetSocketIOConnection } from '@velero-ui-app/plugins/socket.plugin';
import { useMutation } from '@tanstack/vue-query';

export const useAuth = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const router: Router = useRouter();
  const route = useRoute();

  return useMutation({
    mutationFn: async (provider: string) =>
      (
        await axiosInstance.get(`/auth/${provider}`, {
          params: route.query,
        })
      ).data,
    onSuccess: async (data) => {
      if (data) {
        localStorage.setItem('access_token', data.access_token);
        resetSocketIOConnection();
        await router.push('/');
      }
    },
    onError: async (error) => {
      await router.push('/?state=error&reason=sso');
      console.error(error);
    },
  });
};
