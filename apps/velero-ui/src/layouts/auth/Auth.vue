<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          alt="logo"
          class="w-64 h-§4 mr-2"
          src="/src/assets/images/velero.svg"
        />
      </div>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in
          </h1>
          <Alert
            :icon="faCircleExclamation"
            :message="error"
            color="red"
          ></Alert>
          <Alert
            :icon="faCircleExclamation"
            :message="success"
            color="green"
          ></Alert>
          <div class="space-y-4 md:space-y-6">
            <form v-if="basicAuth?.enabled" @submit="basicLogin($event)">
              <div class="mb-6">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="username"
                  >Your username</label
                >
                <input
                  id="username"
                  v-model="username"
                  :disabled="basicLoading"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="username"
                  placeholder="username"
                  required
                  type="text"
                />
              </div>
              <div class="mb-6">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="password"
                  >Password</label
                >
                <input
                  id="password"
                  v-model="password"
                  :disabled="basicLoading"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>

              <button
                :disabled="basicLoading"
                class="flex justify-center items-center w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
              >
                <FontAwesomeIcon
                  v-if="basicLoading"
                  :icon="faCircleNotch"
                  class="w-4 h-4 animate-spin mr-2"
                />
                Sign in
              </button>
            </form>
            <div
              v-if="basicAuth?.enabled && isFederatedAuthEnabled()"
              class="flex items-center mb-1.5 mt-1.5"
            >
              <div class="w-full bg-gray-300 h-0.5"></div>
              <div class="px-3 text-gray-600 text-center">or</div>
              <div class="w-full bg-gray-300 h-0.5"></div>
            </div>
            <GithubAuth />
            <GitlabAuth />
            <GoogleAuth />
            <MicrosoftAuth />
            <OauthAuth />
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-5">
        <span
          class="inline-flex justify-center text-gray-500 text-xs dark:text-white"
          >v{{ version }} - Powered by
          <a
            class="ml-1 hover:text-blue-600"
            href="https://otwld.com/"
            target="_blank"
            >OTWLD</a
          ></span
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue';
import { inject, onBeforeMount, ref, watch } from 'vue';
import type { Router } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleExclamation,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import Alert from '@velero-ui-app/components/Alert.vue';
import type { AppPublicConfig } from '@velero-ui/shared-types';
import { useBasicLogin } from '@velero-ui-app/use/auth/useBasicLogin';
import GoogleAuth from '@velero-ui-app/layouts/auth/federated/GoogleAuth.vue';
import GithubAuth from '@velero-ui-app/layouts/auth/federated/GithubAuth.vue';
import GitlabAuth from '@velero-ui-app/layouts/auth/federated/GitlabAuth.vue';
import MicrosoftAuth from '@velero-ui-app/layouts/auth/federated/MicrosoftAuth.vue';
import OauthAuth from '@velero-ui-app/layouts/auth/federated/OauthAuth.vue';

const { basicAuth, google, gitlab, github, microsoft, oauth } = inject(
  'config',
) as AppPublicConfig;
const router: Router = useRouter();
const route = useRoute();

const version = import.meta.env.APP_VERSION;

const username: Ref<string> = ref('');
const password: Ref<string> = ref('');

const isFederatedAuthEnabled = () =>
  google.enabled ||
  gitlab.enabled ||
  gitlab.enabled ||
  microsoft.enabled ||
  oauth.enabled;

const {
  isLoading: basicLoading,
  error: basicError,
  login,
} = useBasicLogin(username, password);

const basicLogin = ($event) => {
  $event.stopPropagation();
  login();
};

const error: Ref<string> = ref('');
const success: Ref<string> = ref('');

watch(basicError, () => {
  error.value = 'Username or password incorrect!';
});

onBeforeMount(async () => {
  if (route.query?.state === 'error') {
    if (route.query?.reason === 'unauthorized') {
      error.value = 'You must login to access this page.';
    } else if (route.query?.reason === 'inactivity') {
      error.value = 'Your session timed out.';
    } else if (route.query?.reason === 'sso') {
      error.value = 'Unable to process login with external SSO.';
    }
    success.value = '';
  } else if (route.query?.state === 'success') {
    if (route.query?.reason === 'logout') {
      success.value = 'You successfully logged out!';
    }
  }

  if (route.query?.code) {
    success.value = 'Processing login, please wait...';
  }
});
</script>
