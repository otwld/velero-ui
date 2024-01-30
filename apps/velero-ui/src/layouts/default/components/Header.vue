<template>
  <nav
    class="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <router-link to="/" class="flex ml-2 md:mr-24">
            <img
              src="/src/assets/images/Velero.svg"
              class="h-8 mr-3"
              alt="Velero Logo"
            />
          </router-link>
        </div>
        <div class="flex items-center">
          <div class="flex items-center ml-3">
            <div class="flex">
              <div class="flex flex-col text-right">
                <span
                  class="mr-4 font-semibold whitespace-nowrap dark:text-white"
                  >{{ user?.profile.name }}</span
                >
                <span class="text-xs mr-4 whitespace-nowrap dark:text-white">{{
                  user?.profile.email
                }}</span>
              </div>
              <button
                @click="logout()"
                type="button"
                :disabled="isLoading"
                class="inline-flex self-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  v-if="!isLoading"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H1.75A.75.75 0 0 1 1 10Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-if="isLoading"
                  aria-hidden="true"
                  role="status"
                  class="w-5 h-5 animate-spin"
                  viewBox="0 0 100 101"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue';
import { UserManager } from 'oidc-client-ts';
import { useAppStore } from '../../../stores/app.store';

export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const oidcClient: UserManager = inject('oidcClient') as UserManager;
    return { appStore, oidcClient };
  },
  data: () => ({
    user: null,
    isLoading: false,
  }),
  async beforeMount() {
    this.user = await this.oidcClient.getUser();
  },
  methods: {
    async logout() {
      try {
        this.isLoading = true;
        await this.oidcClient.signoutRedirect();
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>
