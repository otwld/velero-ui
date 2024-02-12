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
                <FontAwesomeIcon
                  v-if="!isLoading"
                  :icon="faArrowRightFromBracket"
                  class="w-5 h-5"
                />
                <FontAwesomeIcon
                  v-if="isLoading"
                  :icon="faCircleNotch"
                  class="w-5 h-5 animate-spin"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue';
import {
  faArrowRightFromBracket,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { UserManager } from 'oidc-client-ts';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAppStore } from '@velero-ui-app/stores/app.store';

const appStore = useAppStore();
const oidcClient: UserManager = inject('oidcClient') as UserManager;

onBeforeMount(async () => (user.value = await oidcClient.getUser()));

const user = ref(null);
const isLoading = ref(false);

const logout = async () => {
  try {
    isLoading.value = true;
    await oidcClient.signoutRedirect();
  } catch (e) {
    console.error(e);
  }
};
</script>
