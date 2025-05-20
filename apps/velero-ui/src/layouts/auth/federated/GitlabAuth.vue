<template>
  <button
    v-if="gitlab?.enabled"
    :disabled="loading"
    class="flex justify-center items-center transition duration-200 w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
    type="button"
    @click="redirect()"
  >
    <FontAwesomeIcon :icon="faGitlab" class="!w-4 !h-4 mr-2" />
    {{ t('auth.federated.button.title', { strategy: 'Gitlab' }) }}
    <FontAwesomeIcon
      v-if="loading"
      :icon="faCircleNotch"
      class="!w-4 !h-4 animate-spin ml-2"
    />
  </button>
</template>

<script lang="ts" setup>
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { inject, ref, watch } from 'vue';
import type { AppPublicConfig } from '@velero-ui/shared-types';
import { faGitlab } from '@fortawesome/free-brands-svg-icons';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@velero-ui-app/composables/auth/useAuth';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();
const { mutate: login } = useAuth();

const { gitlab } = inject('config') as AppPublicConfig;

let loading = ref(false);

const redirect = () => {
  loading.value = true;
  const state = uuidv4();
  localStorage.setItem('auth.gitlab.state', state);

  window.location.href = `${gitlab.baseUrl}/oauth/authorize?client_id=${gitlab.clientId}&redirect_uri=${gitlab.redirectUri}&scope=${gitlab.scopes}&response_type=code&state=${state}`;
};

watch(
  () => route.query,
  async () => {
    if (route.query?.code) {
      const state = localStorage.getItem('auth.gitlab.state');

      if (route.query.state === state) {
        loading.value = true;
        login('gitlab');
        localStorage.removeItem('auth.gitlab.state');
      }
    } else {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>
