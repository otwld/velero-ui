<template>
  <button
    v-if="github?.enabled"
    :disabled="loading"
    class="flex justify-center items-center w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
    type="button"
    @click="redirect()"
  >
    <FontAwesomeIcon :icon="faGithub" class="w-4 h-4 mr-2" />
    <p>Sign in with Github</p>
    <FontAwesomeIcon
      v-if="loading"
      :icon="faCircleNotch"
      class="w-4 h-4 animate-spin ml-2"
    />
  </button>
</template>

<script lang="ts" setup>
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { inject, onBeforeMount, ref } from 'vue';
import type { AppPublicConfig } from '@velero-ui/shared-types';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@velero-ui-app/composables/auth/useAuth';

const route = useRoute();
const { login, isLoading } = useAuth();

const { github } = inject('config') as AppPublicConfig;

let loading = ref(false);

const redirect = () => {
  loading.value = true;
  const state = uuidv4();
  localStorage.setItem('auth.github.state', state);

  window.location.href = `https://github.com/login/oauth/authorize?client_id=${github.clientId}&redirect_uri=${github.redirectUri}&scope=${github.scopes}&response_type=code&state=${state}`;
};

onBeforeMount(async () => {
  if (route.query?.code) {
    const state = localStorage.getItem('auth.github.state');

    if (route.query.state === state) {
      loading.value = true;
      login('github');
      localStorage.removeItem('auth.github.state');
    }
  }
});
</script>
