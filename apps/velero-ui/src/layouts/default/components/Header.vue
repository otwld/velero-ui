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
            class="flex p-2 text-gray-600 transition duration-200 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            @click="appStore.toggleSidebar()"
          >
            <FontAwesomeIcon :icon="faBars" class="!w-5 !h-5" />
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
          <div v-click-out="clickOutsideTimezoneDropdown" class="relative">
            <button
              class="flex ml-3 text-gray-600 transition duration-200 rounded dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 text-sm p-2"
              type="button"
              @click="toggleTimezoneDropdown()"
            >
              <FontAwesomeIcon :icon="faGlobe" class="!w-5 !h-5" />
            </button>

            <div
              id="dropdown-3"
              :class="{ hidden: hiddenTimezoneDropdown }"
              class="absolute z-50 mt-2 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-[300px] dark:bg-gray-700"
            >
              <div class="flex p-2">
                <FormKit
                  v-model="timezoneModel"
                  :options="getTimezones"
                  label="Timezone"
                  name="timezone"
                  outer-class="mb-2"
                  placeholder="Select timezone"
                  type="select"
                >
                  <template #label>
                    <label
                      class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
                      >Select timezone
                    </label>
                  </template>
                </FormKit>
              </div>
            </div>
          </div>
          <div v-click-out="clickOutsideLanguageDropdown" class="relative">
            <button
              class="flex ml-3 text-gray-600 transition duration-200 rounded dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 text-sm p-2"
              type="button"
              @click="toggleLanguageDropdown()"
            >
              <FontAwesomeIcon :icon="faLanguage" class="!w-5 !h-5" />
            </button>
            <div
              id="dropdown-3"
              :class="{ hidden: hiddenLanguageDropdown }"
              class="absolute z-50 mt-2 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow min-w-[200px] dark:bg-gray-700"
            >
              <ul
                aria-labelledby="dropdownDefaultButton"
                class="max-h-48 py-2 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
              >
                <li v-for="(lang, index) of getLanguages()" :key="index">
                  <button
                    :class="{
                      'bg-gray-100': isCurrentLanguage(lang.code),
                      'dark:bg-gray-600': isCurrentLanguage(lang.code),
                    }"
                    class="w-full transition duration-200 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    @click="appStore.setLanguage(lang.code)"
                  >
                    {{ lang.title }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <!--
          <button
            class="flex ml-3 text-gray-600 rounded dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 text-sm p-2"
            type="button"
          >
            <FontAwesomeIcon :icon="faSun" class="!w-5 !h-5" />
            <FontAwesomeIcon :icon="faMoon" class="hidden !w-5 !h-5" />
          </button> -->
          <div
            v-if="!noAuthRequired"
            v-click-out="clickOutside"
            class="flex flex-col items-center"
          >
            <div class="flex items-center ml-3">
              <button
                id="user-menu-button-2"
                aria-expanded="false"
                class="flex items-center text-sm transition duration-200 pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
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
                  class="w-8 h-8 text-gray-900 dark:text-white"
                />
                <p class="ms-3">
                  {{ user.name }}
                </p>
                <FontAwesomeIcon :icon="faAngleDown" class="w-2.5 h-2.5 ms-3" />
              </button>
            </div>
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
                  {{
                    user?.email
                      ? user.email
                      : user.provider === 'ldap'
                        ? t('header.account.ldap')
                        : t('header.account.local')
                  }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <button
                    class="block w-full transition duration-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    type="button"
                    @click="logout()"
                  >
                    {{ t('header.signOut.button.title') }}
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
import { computed, inject, type Ref, ref, watch } from 'vue';
import {
  faAngleDown,
  faBars,
  faGlobe,
  faLanguage,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { getUser } from '@velero-ui-app/utils/jwt.utils';
import { type AppPublicConfig, type JwtPayload } from '@velero-ui/shared-types';
import { useAppStore } from '@velero-ui-app/stores/app.store';
import { useI18n } from 'vue-i18n';
import { getLanguages } from '@velero-ui/i18n';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import { storeToRefs } from 'pinia';
import timezones, { type TimeZone } from 'timezones-list';

const { t } = useI18n();
const socket: SocketIO = inject('socketIo');

const { noAuthRequired } = inject('config') as AppPublicConfig;

const router: Router = useRouter();
const appStore = useAppStore();
const { language, timezone } = storeToRefs(appStore);

const timezoneModel: Ref<string> = ref(timezone.value);

const isLoading: Ref<boolean> = ref(false);
const hiddenDropdown = ref(true);
const hiddenLanguageDropdown = ref(true);
const hiddenTimezoneDropdown = ref(true);

const user: JwtPayload = getUser(localStorage.getItem('access_token'));

const toggleDropdown = () => (hiddenDropdown.value = !hiddenDropdown.value);
const toggleLanguageDropdown = () =>
  (hiddenLanguageDropdown.value = !hiddenLanguageDropdown.value);
const toggleTimezoneDropdown = () =>
  (hiddenTimezoneDropdown.value = !hiddenTimezoneDropdown.value);

const clickOutside = () => (hiddenDropdown.value ? null : toggleDropdown());
const clickOutsideLanguageDropdown = () =>
  hiddenLanguageDropdown.value ? null : toggleLanguageDropdown();
const clickOutsideTimezoneDropdown = () =>
  hiddenTimezoneDropdown.value ? null : toggleTimezoneDropdown();

const getTimezones = computed(() =>
  timezones.map((t: TimeZone) => ({
    label: t.label,
    value: t.tzCode,
    selected: timezone.value === t.tzCode,
  }))
);

watch(timezoneModel, () => appStore.setTimezone(timezoneModel.value));

const logout = async () => {
  try {
    isLoading.value = true;
    localStorage.removeItem('access_token');
    await router.push('/login?state=success&reason=logout');
    socket.io.close();
  } catch (e) {
    console.error(e);
  }
};

const isCurrentLanguage = (lang: string) => language.value === lang;
</script>
