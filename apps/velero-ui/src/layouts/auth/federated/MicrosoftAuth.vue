<template>
  <button
    v-if="microsoft?.enabled"
    :disabled="loading"
    class="flex justify-center items-center w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
    type="button"
    @click="redirect()"
  >
    <FontAwesomeIcon :icon="faMicrosoft" class="!w-4 !h-4 mr-2" />
    {{ t('auth.federated.button.title', { strategy: 'Microsoft' }) }}
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
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@velero-ui-app/composables/auth/useAuth';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();
const { login, isLoading } = useAuth();

const { microsoft } = inject('config') as AppPublicConfig;

let loading = ref(false);

const redirect = () => {
  loading.value = true;
  const state = uuidv4();
  localStorage.setItem('auth.microsoft.state', state);

  window.location.href = `https://login.microsoftonline.com/${microsoft.tenant}/oauth2/v2.0/authorize?client_id=${microsoft.clientId}&redirect_uri=${microsoft.redirectUri}&scope=${microsoft.scopes}&response_type=code&state=${state}`;
};

watch(
  () => route.query,
  async () => {
    if (route.query?.code) {
      const state = localStorage.getItem('auth.microsoft.state');

      if (route.query.state === state) {
        loading.value = true;
        login('microsoft');
        localStorage.removeItem('auth.microsoft.state');
      }
    } else {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>
