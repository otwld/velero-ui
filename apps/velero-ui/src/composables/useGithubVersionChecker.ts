import { inject } from 'vue';
import { gtr } from 'semver';
import type { AxiosInstance } from 'axios';
import { useMutation } from '@tanstack/vue-query';


export const useGithubVersionChecker = (owner: string, repository: string) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useMutation({
    mutationFn: async (version: string) => {
      const data = (
        await axiosInstance.get<
          [
            {
              html_url: string;
              tag_name: string;
              draft: boolean;
              prerelease: boolean;
            },
          ]
        >(`https://api.github.com/repos/${owner}/${repository}/releases`)
      ).data;

      if (data && data.length > 0) {
        const latestVersion: string = data[0].tag_name;

        if (
          gtr(latestVersion, version) &&
          !data[0].draft &&
          !data[0].prerelease
        ) {
          return data[0];
        }
        return null;
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
