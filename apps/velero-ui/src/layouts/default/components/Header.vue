<template>
  <nav
    class="fixed z-10 w-full h-16 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button
            aria-controls="sidebar"
            aria-expanded="true"
            class="flex p-2 text-gray-600 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            @click="appStore.toggleSidebar()"
          >
            <FontAwesomeIcon :icon="faBars" class="w-5 h-5" />
          </button>
          <router-link class="flex ml-2 md:mr-24" to="/">
            <img
              alt="Velero Logo"
              class="h-8 mr-3"
              src="/src/assets/images/velero.svg"
            />
          </router-link>
        </div>
        <div class="flex items-center">
          <div v-click-out="clickOutside" class="flex flex-col items-center">
            <div class="flex items-center ml-3">
              <button
                id="user-menu-button-2"
                aria-expanded="false"
                class="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                type="button"
                @click="toggleDropdown()"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  v-if="user.picture"
                  :src="user.picture"
                  alt="user photo"
                  class="w-8 h-8 rounded-full text-gray-900"
                />
                <FontAwesomeIcon
                  v-if="!user.picture"
                  :icon="faUserCircle"
                  class="w-8 h-8 text-gray-900"
                />
                <p class="ms-3">{{ user.name }}</p>
                <FontAwesomeIcon :icon="faAngleDown" class="w-2.5 h-2.5 ms-3" />
              </button>
            </div>
            <!-- Dropdown menu -->
            <div
              id="dropdown-2"
              :class="{ hidden: hiddenDropdown }"
              class="absolute z-50 mt-10 ml-3 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
            >
              <div class="px-4 py-3" role="none">
                <p
                  class="text-xs text-gray-900 truncate dark:text-gray-300"
                  role="none"
                >
                  {{ user?.email ? user.email : 'Local account' }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <button
                    class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    type="button"
                    @click="logout()"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts" setup>
import { type Ref, ref } from 'vue';
import {
  faAngleDown,
  faBars,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { getUser } from '@velero-ui-app/utils/jwt.utils';
import type { JwtPayload } from '@velero-ui/shared-types';
import { useAppStore } from '@velero-ui-app/stores/app.store';

const router: Router = useRouter();
const appStore = useAppStore();

const isLoading: Ref<boolean> = ref(false);
const hiddenDropdown = ref(true);

const user: JwtPayload = getUser(localStorage.getItem('access_token'));

const toggleDropdown = () => (hiddenDropdown.value = !hiddenDropdown.value);

const clickOutside = () => (hiddenDropdown.value ? null : toggleDropdown());

const logout = async () => {
  try {
    isLoading.value = true;
    localStorage.removeItem('access_token');
    await router.push('/login?state=success&reason=logout');
  } catch (e) {
    console.error(e);
  }
};
</script>
