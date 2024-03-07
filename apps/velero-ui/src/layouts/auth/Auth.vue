<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-64 h-§4 mr-2"
          src="/src/assets/images/Velero.svg"
          alt="logo"
        />
      </a>
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
            :message="error"
            color="red"
            :icon="faCircleExclamation"
          ></Alert>
          <Alert
            :message="success"
            color="green"
            :icon="faCircleExclamation"
          ></Alert>
          <form
            class="space-y-4 md:space-y-6"
            @submit.prevent="basicLogin($event)"
          >
            <div class="">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>

            <button
              type="submit"
              :disabled="basicLoading"
              class="flex justify-center items-center w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <FontAwesomeIcon
                v-if="basicLoading"
                :icon="faCircleNotch"
                class="w-4 h-4 animate-spin mr-2"
              />
              Sign in
            </button>
            <div class="flex items-center mb-1.5 mt-1.5">
              <div class="w-full bg-gray-300 h-0.5"></div>
              <div class="px-3 text-gray-600 text-center">or</div>
              <div class="w-full bg-gray-300 h-0.5"></div>
            </div>
            <button
              @click="ssoLogin()"
              type="button"
              :disabled="ssoLoading"
              class="flex justify-center items-center w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              <FontAwesomeIcon
                v-if="ssoLoading"
                :icon="faCircleNotch"
                class="w-4 h-4 animate-spin mr-2"
              />
              Single Sign On Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue';
import type { UserManager } from 'oidc-client-ts';
import type { Router } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import Alert from '@velero-ui-app/components/Alert.vue';

const oidcClient: UserManager = inject('oidcClient') as UserManager;
const router: Router = useRouter();
const route = useRoute();

const ssoLoading = ref(false);
const basicLoading = ref(false);
const error = ref('');
const success = ref('');

onBeforeMount(async () => {
  if (route.query?.state === 'error') {
    if (route.query?.reason === 'unauthorized') {
      error.value = 'You must login to access this page.';
    }
    if (route.query?.reason === 'inactivity') {
      error.value = 'Your session timed out.';
    }
  } else if (route.query?.state === 'success') {
    if (route.query?.reason === 'logout') {
      success.value = 'You successfully logged out!';
    }
  }

  if (window.location.href.indexOf('#') >= 0) {
    success.value = 'Processing login, please wait...';
    ssoLoading.value = true;
    try {
      await oidcClient.signinRedirectCallback();

      await router.push('/');
    } catch (e) {
      ssoLoading.value = false;
      console.error(e);
    }
  }
});

const ssoLogin = async () => {
  try {
    ssoLoading.value = true;
    await oidcClient.signinRedirect({});
  } catch (e) {
    error.value = 'Unable to proceed request, please retry.';
    ssoLoading.value = false;
    console.error(e);
  }
};
const basicLogin = (event: Event) => {
  event.preventDefault();
  basicLoading.value = true;
};
</script>
