<template>
  <aside
    id="sidebar"
    class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width"
    aria-label="Sidebar"
  >
    <div
      class="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
        <div
          class="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
        >
          <ul class="pb-2 space-y-2">
            <li>
              <router-link
                :to="Pages.HOME.path"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faChartPie"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="Pages.BACKUPS.path"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faFloppyDisk"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">Backups</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="Pages.SCHEDULES.path"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faClock"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">Schedules</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="Pages.RESTORES.path"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faClockRotateLeft"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />

                <span class="ml-3">Restores</span>
              </router-link>
            </li>
            <li>
              <router-link
                to=""
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faFolderTree"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">Backup Repositories</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="Pages.STORAGE_LOCATIONS.path"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faServer"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">Storage Locations</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="Pages.SNAPSHOT_LOCATIONS.path"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faDatabase"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">Snapshot Locations</span>
              </router-link>
            </li>
            <li>
              <button
                type="button"
                class="flex w-full items-center p-2 text-base text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                aria-controls="dropdown-requests"
                data-collapse-toggle="dropdown-requests"
              >
                <FontAwesomeIcon
                  :icon="faFileLines"
                  class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="flex-1 text-left ml-3">Requests</span>
                <FontAwesomeIcon
                  :icon="faAngleDown"
                  class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
              </button>
              <ul id="dropdown-requests" class="hidden py-2 space-y-2">
                <li>
                  <router-link
                    to="/"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faFileExcel"
                      class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">Delete Backup Requests</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faFileArrowDown"
                      class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">Download Requests</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faFileWaveform"
                      class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">Server Status Requests</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <div class="pt-2 space-y-2">
            <router-link
              :to="Pages.SETTINGS.path"
              class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                :icon="faGear"
                class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              />
              <span class="ml-3">Settings</span>
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800"
      >
        <div class="flex flex-col">
          <div class="flex justify-center">
            <a
              href="https://github.com/otwld/velero-ui"
              target="_blank"
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FontAwesomeIcon
                :icon="faGithub"
                class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              />
            </a>
          </div>
          <span
            class="inline-flex justify-center text-gray-500 text-xs dark:text-white"
            >v{{ version }} - Powered by
            <a class="ml-1 hover:text-blue-600" href="https://outworld.fr/"
              >Outworld</a
            ></span
          >
        </div>
      </div>
    </div>
  </aside>
</template>
<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChartPie,
  faServer,
  faDatabase,
  faGear,
  faClock,
  faClockRotateLeft,
  faFloppyDisk,
  faFolderTree,
  faAngleDown,
  faFileArrowDown,
  faFileExcel,
  faFileWaveform,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { defineComponent } from 'vue';
import { Pages } from '../../../utils/constants.utils';
import { initDropdowns } from 'flowbite';

export default defineComponent({
  name: 'Sidebar',
  components: { FontAwesomeIcon },
  mounted() {
    initDropdowns();
  },
  data: () => ({
    Pages,
    faChartPie,
    faServer,
    faDatabase,
    faGear,
    faClock,
    faClockRotateLeft,
    faFloppyDisk,
    faGithub,
    faFolderTree,
    faAngleDown,
    faFileArrowDown,
    faFileExcel,
    faFileWaveform,
    faFileLines,
    version: import.meta.env.APP_VERSION,
  }),
});
</script>
