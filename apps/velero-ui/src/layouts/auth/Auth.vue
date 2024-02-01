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
                class=" w-4 h-4 animate-spin mr-2"
              />
              Sign in
            </button>

            <button
              @click="ssoLogin()"
              type="button"
              :disabled="ssoLoading"
              class="flex justify-center items-center w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              <FontAwesomeIcon
                v-if="ssoLoading"
                :icon="faCircleNotch"
                class=" w-4 h-4 animate-spin mr-2"
              />
              Single Sign On Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { UserManager } from 'oidc-client-ts';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
  name: 'Header',
  components: { FontAwesomeIcon },
  setup() {
    const oidcClient: UserManager = inject('oidcClient') as UserManager;
    const router: Router = useRouter();
    return { oidcClient, router };
  },
  data: () => ({
    faCircleNotch,
    ssoLoading: false,
    basicLoading: false,
  }),
  async beforeMount() {
    if (window.location.href.indexOf('#') >= 0) {
      this.ssoLoading = true;
      try {
        await this.oidcClient.signinRedirectCallback();

        await this.router.push('/');
      } catch (e) {
        this.ssoLoading = false;
        console.error(e);
      }
    }
  },
  methods: {
    ssoLogin() {
      try {
        this.ssoLoading = true;
        this.oidcClient.signinRedirect({});
      } catch (e) {
        this.ssoLoading = false;
        console.error(e);
      }
    },
    async basicLogin(event: Event) {
      event.preventDefault();
      this.basicLoading = true;
    },
  },
});
</script>
