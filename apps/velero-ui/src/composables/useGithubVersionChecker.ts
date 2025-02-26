import { ref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios';
import { gtr } from 'semver';

export const useGithubVersionChecker = (owner: string, repository: string) => {
  const { execute, isLoading, data, error } = useAxios();

  const newVersion = ref(null);

  const get = async (version: string) => {
    try {
      await execute(
        `https://api.github.com/repos/${owner}/${repository}/releases`,
        {
          method: 'get',
        },
      );

      if (data && data.value.length > 0) {
        const latestVersion: string = data.value[0].tag_name;

        if (
          gtr(latestVersion, version) &&
          !data.value[0].draft &&
          !data.value[0].prerelease
        ) {
          newVersion.value = data.value[0];
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { get, isLoading, error, newVersion };
};
