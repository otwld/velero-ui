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
            {{ t('auth.signIn') }}
          </h1>
          <Alert :icon="faCircleExclamation" :message="error" color="red" />
          <Alert :icon="faCircleExclamation" :message="success" color="green" />
          <div class="space-y-4 md:space-y-6">
            <form
              v-if="basicAuth?.enabled"
              class="m-0"
              @submit="classicLogin($event)"
            >
              <div class="mb-6">
                <FormKit
                  v-model="username"
                  :disabled="basicLoading"
                  :placeholder="t('auth.form.username.placeholder')"
                  :validation="[['required']]"
                  name="username"
                  type="text"
                >
                  <template #label>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ t('auth.form.username.label') }}</label
                    >
                  </template>
                </FormKit>
              </div>
              <div class="mb-6">
                <FormKit
                  v-model="password"
                  :disabled="basicLoading"
                  :validation="[['required']]"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                >
                  <template #label>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >{{ t('auth.form.password.label') }}</label
                    >
                  </template>
                </FormKit>
              </div>

              <button
                :disabled="basicLoading"
                class="flex justify-center items-center w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
              >
                <FontAwesomeIcon
                  v-if="basicLoading"
                  :icon="faCircleNotch"
                  class="!w-4 !h-4 animate-spin mr-2"
                />
                {{ t('auth.form.button.title') }}
              </button>
            </form>
            <div
              v-if="basicAuth?.enabled && isFederatedAuthEnabled()"
              class="flex items-center my-3"
            >
              <div class="w-full bg-gray-300 h-0.5" />
              <div class="px-3 text-gray-600 text-center">
                {{ t('auth.divider') }}
              </div>
              <div class="w-full bg-gray-300 h-0.5" />
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
          >{{ t('global.powered', { version }) }}
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
import { inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleExclamation,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import Alert from '@velero-ui-app/components/Alert.vue';
import type { AppPublicConfig } from '@velero-ui/shared-types';
import GoogleAuth from '@velero-ui-app/layouts/auth/federated/GoogleAuth.vue';
import GithubAuth from '@velero-ui-app/layouts/auth/federated/GithubAuth.vue';
import GitlabAuth from '@velero-ui-app/layouts/auth/federated/GitlabAuth.vue';
import MicrosoftAuth from '@velero-ui-app/layouts/auth/federated/MicrosoftAuth.vue';
import OauthAuth from '@velero-ui-app/layouts/auth/federated/OauthAuth.vue';
import { useFormAuth } from '@velero-ui-app/composables/auth/useFormAuth';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { basicAuth, google, gitlab, github, microsoft, oauth } = inject(
  'config'
) as AppPublicConfig;
const route = useRoute();

const version = import.meta.env.APP_VERSION;

const username: Ref<string> = ref('');
const password: Ref<string> = ref('');

const isFederatedAuthEnabled = () =>
  google.enabled ||
  gitlab.enabled ||
  github.enabled ||
  microsoft.enabled ||
  oauth.enabled;

const { isPending: basicLoading, mutate: login } = useFormAuth();

const classicLogin = ($event) => {
  $event.preventDefault();
  login({ username: username.value, password: password.value });
};

const error: Ref<string> = ref('');
const success: Ref<string> = ref('');

watch(
  () => route.query,
  async () => {
    if (route.query?.state === 'error') {
      error.value = t(`auth.message.error.${route.query?.reason}`);
      success.value = '';
    } else if (route.query?.state === 'success') {
      success.value = t(`auth.message.success.${route.query?.reason}`);
      error.value = '';
    }

    if (route.query?.code) {
      success.value = t(`auth.message.success.code`);
    }
  },
  { immediate: true }
);
</script>
