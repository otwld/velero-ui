<template>
  <aside
    id="sidebar"
    :class="{
      hidden: hideSidebar,
      'lg:flex': hideSidebar,
      'lg:hidden': !hideSidebar,
    }"
    aria-label="Sidebar"
    class="fixed z-10 top-0 left-0 flex flex-col flex-shrink-0 w-64 mt-16 h-[calc(100vh-4rem)] font-normal duration-75 transition-width"
  >
    <div
      class="relative overflow-y-auto flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex flex-col flex-1 pt-5 pb-4">
        <div
          class="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
        >
          <ul class="pb-2 space-y-2">
            <li>
              <router-link
                :to="Pages.HOME.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faChartPie"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">{{ t('dashboard.title') }}</span>
              </router-link>
            </li>
            <li v-if="can(Action.Read, Resources.BACKUP.plural)">
              <router-link
                :to="Pages.BACKUPS.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faFloppyDisk"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">{{ t('backups.title') }}</span>
              </router-link>
            </li>
            <li v-if="can(Action.Read, Resources.SCHEDULE.plural)">
              <router-link
                :to="Pages.SCHEDULES.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faClock"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">{{ t('schedules.title') }}</span>
              </router-link>
            </li>
            <li v-if="can(Action.Read, Resources.RESTORE.plural)">
              <router-link
                :to="Pages.RESTORES.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faClockRotateLeft"
                  active-class="bg-gray-100 dark:bg-gray-700"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />

                <span class="ml-3">{{ t('restores.title') }}</span>
              </router-link>
            </li>
            <li v-if="can(Action.Read, Resources.BACKUP_REPOSITORY.plural)">
              <router-link
                :to="Pages.BACKUP_REPOSITORIES.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faFolderTree"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">{{ t('backupRepositories.title') }}</span>
              </router-link>
            </li>
            <li
              v-if="can(Action.Read, Resources.BACKUP_STORAGE_LOCATION.plural)"
            >
              <router-link
                :to="Pages.STORAGE_LOCATIONS.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faServer"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">{{ t('storageLocations.title') }}</span>
              </router-link>
            </li>
            <li
              v-if="can(Action.Read, Resources.VOLUME_SNAPSHOT_LOCATION.plural)"
            >
              <router-link
                :to="Pages.SNAPSHOT_LOCATIONS.path"
                active-class="bg-gray-100 dark:bg-gray-700"
                class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  :icon="faDatabase"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="ml-3">{{ t('snapshotLocations.title') }}</span>
              </router-link>
            </li>
            <li
              v-if="
                canOr([
                  {
                    action: Action.Read,
                    subject: Resources.POD_VOLUME_BACKUP.plural,
                  },
                  {
                    action: Action.Read,
                    subject: Resources.POD_VOLUME_RESTORE.plural,
                  },
                ])
              "
            >
              <button
                aria-controls="dropdown-pod-volumes"
                class="flex w-full items-center p-2 text-base text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                data-collapse-toggle="dropdown-pod-volumes"
                type="button"
                @click="toggleDropdownPodVolumes()"
              >
                <FontAwesomeIcon
                  :icon="faCubes"
                  class="flex-shrink-0 !w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="flex-1 text-left ml-3">Pod Volumes</span>
                <FontAwesomeIcon
                  v-if="hiddenDropdownPodVolumes"
                  :icon="faAngleDown"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <FontAwesomeIcon
                  v-if="!hiddenDropdownPodVolumes"
                  :icon="faAngleUp"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
              </button>
              <ul
                id="dropdown-pod-volumes"
                :class="{ hidden: hiddenDropdownPodVolumes }"
                class="py-2 space-y-2"
              >
                <li v-if="can(Action.Read, Resources.POD_VOLUME_BACKUP.plural)">
                  <router-link
                    :to="Pages.POD_VOLUME_BACKUPS.path"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faCube"
                      class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">Pod Volume Backups</span>
                  </router-link>
                </li>
                <li
                  v-if="can(Action.Read, Resources.POD_VOLUME_RESTORE.plural)"
                >
                  <router-link
                    :to="Pages.POD_VOLUME_RESTORES.path"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faCube"
                      class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">Pod Volume Restores</span>
                  </router-link>
                </li>
              </ul>
            </li>
            <li
              v-if="
                canOr([
                  {
                    action: Action.Read,
                    subject: Resources.DELETE_BACKUP_REQUEST.plural,
                  },
                  {
                    action: Action.Read,
                    subject: Resources.SERVER_STATUS_REQUEST.plural,
                  },
                  {
                    action: Action.Read,
                    subject: Resources.DOWNLOAD_REQUEST.plural,
                  },
                ])
              "
            >
              <button
                aria-controls="dropdown-requests"
                class="flex w-full items-center p-2 text-base text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                data-collapse-toggle="dropdown-requests"
                type="button"
                @click="toggleDropdown()"
              >
                <FontAwesomeIcon
                  :icon="faFileLines"
                  class="flex-shrink-0 !w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <span class="flex-1 text-left ml-3">{{
                  t('requests.title')
                }}</span>
                <FontAwesomeIcon
                  v-if="hiddenDropdown"
                  :icon="faAngleDown"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
                <FontAwesomeIcon
                  v-if="!hiddenDropdown"
                  :icon="faAngleUp"
                  class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
              </button>
              <ul
                id="dropdown-requests"
                :class="{ hidden: hiddenDropdown }"
                class="py-2 space-y-2"
              >
                <li
                  v-if="
                    can(Action.Read, Resources.DELETE_BACKUP_REQUEST.plural)
                  "
                >
                  <router-link
                    :to="Pages.DELETE_BACKUP_REQUESTS.path"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faFileExcel"
                      class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">{{
                      t('deleteBackupRequests.title')
                    }}</span>
                  </router-link>
                </li>
                <li v-if="can(Action.Read, Resources.DOWNLOAD_REQUEST.plural)">
                  <router-link
                    :to="Pages.DOWNLOAD_REQUESTS.path"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faFileArrowDown"
                      class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">{{ t('downloadRequests.title') }}</span>
                  </router-link>
                </li>
                <li
                  v-if="
                    can(Action.Read, Resources.SERVER_STATUS_REQUEST.plural)
                  "
                >
                  <router-link
                    :to="Pages.SERVER_STATUS_REQUESTS.path"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon
                      :icon="faFileWaveform"
                      class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <span class="ml-3">{{
                      t('serverStatusRequest.title')
                    }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <div v-if="can(Action.Manage, 'all')" class="pt-2 space-y-2">
            <router-link
              :to="Pages.SETTINGS.path"
              active-class="bg-gray-100 dark:bg-gray-700"
              class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                :icon="faGear"
                class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              />
              <span class="ml-3">{{ t('settings.title') }}</span>
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="relative bottom-0 left-0 justify-center w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800"
      >
        <div class="flex flex-col">
          <div class="flex justify-center">
            <a
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              href="https://github.com/otwld/velero-ui"
              target="_blank"
            >
              <FontAwesomeIcon
                :icon="faGithub"
                class="!w-5 !h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              />
            </a>
          </div>
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
    </div>
  </aside>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faChartPie,
  faClock,
  faClockRotateLeft,
  faCube,
  faCubes,
  faDatabase,
  faFileArrowDown,
  faFileExcel,
  faFileLines,
  faFileWaveform,
  faFloppyDisk,
  faFolderTree,
  faGear,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { ref } from 'vue';
import { useAppStore } from '@velero-ui-app/stores/app.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { Action } from '@velero-ui/shared-types';
import { Resources } from '@velero-ui/velero';
import { can, canOr } from '@velero-ui-app/utils/policy.utils';

const { t } = useI18n();

const appStore = useAppStore();
const { hideSidebar } = storeToRefs(appStore);

const hiddenDropdown = ref(true);
const hiddenDropdownPodVolumes = ref(true);

const toggleDropdown = () => (hiddenDropdown.value = !hiddenDropdown.value);
const toggleDropdownPodVolumes = () =>
  (hiddenDropdownPodVolumes.value = !hiddenDropdownPodVolumes.value);

const version = import.meta.env.APP_VERSION;
</script>
