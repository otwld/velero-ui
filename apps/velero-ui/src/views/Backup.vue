<template>
  <div v-if="backup"
    class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900"
  >
    <div class="col-span-full xl:col-auto">
      <div
        class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
      >
        <div
          class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="mb-4 rounded-lg w-20 h-20 sm:mb-0 xl:mb-4 2xl:mb-0"
          >
            <path
              d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z"
            />
            <path
              d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z"
            />
            <path
              d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z"
            />
          </svg>

          <div>
            <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">
              {{ backup.metadata.name }}
            </h3>
            <div class="mb-4 text-xs text-gray-500 dark:text-gray-400">
              {{ backup.metadata.uid }}
            </div>
            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="restore()"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="w-4 h-4 mr-2 -ml-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Restore
              </button>
              <button
                type="button"
                @click="download()"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 mr-2 -ml-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Download
              </button>
              <button
                type="button"
                @click="remove()"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
              >
                <svg
                  class="w-4 h-4 mr-2 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
      >
        <h3 class="mb-4 text-xl font-semibold dark:text-white">
          Language & Time
        </h3>
        <div class="mb-4">
          <label
            for="settings-language"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Select language</label
          >
          <select
            id="settings-language"
            name="countries"
            class="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>English (US)</option>
            <option>Italiano</option>
            <option>Français (France)</option>
            <option>正體字</option>
            <option>Español (España)</option>
            <option>Deutsch</option>
            <option>Português (Brasil)</option>
          </select>
        </div>
        <div class="mb-6">
          <label
            for="settings-timezone"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Time Zone</label
          >
          <select
            id="settings-timezone"
            name="countries"
            class="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>GMT+0 Greenwich Mean Time (GMT)</option>
            <option>GMT+1 Central European Time (CET)</option>
            <option>GMT+2 Eastern European Time (EET)</option>
            <option>GMT+3 Moscow Time (MSK)</option>
            <option>GMT+5 Pakistan Standard Time (PKT)</option>
            <option>GMT+8 China Standard Time (CST)</option>
            <option>GMT+10 Eastern Australia Standard Time (AEST)</option>
          </select>
        </div>
        <div>
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save all
          </button>
        </div>
      </div>
    </div>
    <div class="col-span-2">
      <div
        class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
      >
        <div class="flow-root">
          <h3 class="text-xl font-semibold dark:text-white">Describe</h3>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-base font-semibold text-gray-900 truncate dark:text-white"
                  >
                    California 123.123.123.123
                  </p>
                  <p
                    class="text-sm font-normal text-gray-500 truncate dark:text-gray-400"
                  >
                    Chrome on macOS
                  </p>
                </div>
                <div class="inline-flex items-center">
                  <a
                    href="#"
                    class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >Revoke</a
                  >
                </div>
              </div>
            </li>
            <li class="pt-4 pb-6">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-base font-semibold text-gray-900 truncate dark:text-white"
                  >
                    Rome 24.456.355.98
                  </p>
                  <p
                    class="text-sm font-normal text-gray-500 truncate dark:text-gray-400"
                  >
                    Safari on iPhone
                  </p>
                </div>
                <div class="inline-flex items-center">
                  <a
                    href="#"
                    class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >Revoke</a
                  >
                </div>
              </div>
            </li>
          </ul>
          <div>
            <button
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              See more
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="grid px-4  xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">
          Logs
        </h3>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          You can set up Themesberg to get email notifications
        </p>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Item 1 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Rating reminders
              </div>
              <div
                class="text-base font-normal text-gray-500 dark:text-gray-400"
              >
                Send an email reminding me to rate an item a week after purchase
              </div>
            </div>
            <label
              for="rating-reminders"
              class="relative flex items-center cursor-pointer"
            >
              <input type="checkbox" id="rating-reminders" class="sr-only" />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"
              ></span>
            </label>
          </div>
          <!-- Item 2 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Item update notifications
              </div>
              <div
                class="text-base font-normal text-gray-500 dark:text-gray-400"
              >
                Send user and product notifications for you
              </div>
            </div>
            <label
              for="item-update"
              class="relative flex items-center cursor-pointer"
            >
              <input type="checkbox" id="item-update" class="sr-only" checked />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"
              ></span>
            </label>
          </div>
          <!-- Item 3 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Item comment notifications
              </div>
              <div
                class="text-base font-normal text-gray-500 dark:text-gray-400"
              >
                Send me an email when someone comments on one of my items
              </div>
            </div>
            <label
              for="item-comment"
              class="relative flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="item-comment"
                class="sr-only"
                checked
              />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"
              ></span>
            </label>
          </div>
          <!-- Item 4 -->
          <div class="flex items-center justify-between pt-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Buyer review notifications
              </div>
              <div
                class="text-base font-normal text-gray-500 dark:text-gray-400"
              >
                Send me an email when someone leaves a review with their rating
              </div>
            </div>
            <label
              for="buyer-rev"
              class="relative flex items-center cursor-pointer"
            >
              <input type="checkbox" id="buyer-rev" class="sr-only" />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"
              ></span>
            </label>
          </div>
        </div>
        <div class="mt-6">
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save all
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { convertTimestampToDate, getRemainingTime } from '../utils/date.utils';

export default defineComponent({
  name: 'Backup',
  setup() {
    const backupStore = useBackupStore();
    const { backup } = storeToRefs(backupStore);

    const router: Router = useRouter();
    return { backupStore, router, backup };
  },
  beforeMount() {
    this.backupStore.get(
      this.router.currentRoute.value.params.name,
      this.router.currentRoute.value.params.namespace
    );
  },
  methods: {
    getRemainingTime,
    convertTimestampToDate,
    remove(): void {
      // this.backupStore.delete([this.data.metadata.name]);
      console.log('click delete');
    },
    restore(): void {
      console.log('click restore');
    },
    download(): void {
      console.log('click download');
    },
  },
});
</script>
