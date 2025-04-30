<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-4 xl:gap-4">
    <div class="col-span-full mb-2 xl:col-auto">
      <div
        class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
      >
        <div class="items-center flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
          <FontAwesomeIcon
            :icon="faFloppyDisk"
            class="!w-16 !h-16 mr-2 dark:text-white"
          />
          <div class="flex-col pl-2">
            <div
              v-if="isFetching && !data"
              class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-16 mb-4"
            />
            <h3
              v-if="data"
              class="mb-1 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ data?.totalBackups.toString() || t('global.na') }}
            </h3>
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('global.backup', data?.totalBackups) }}
            </div>
          </div>
        </div>
        <div class="flex self-center">
          <router-link
            :to="Pages.BACKUPS.path"
            class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            title="See"
            type="button"
          >
            <FontAwesomeIcon :icon="faChevronRight" class="!w-5 !h-5" />
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-span-full mb-2 xl:col-auto">
      <div
        class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
      >
        <div class="items-center flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
          <FontAwesomeIcon
            :icon="faClock"
            class="!w-16 !h-16 mr-2 dark:text-white"
          />
          <div class="flex-col pl-2">
            <div
              v-if="isFetching && !data"
              class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-16 mb-4"
            />
            <h3
              v-if="data"
              class="mb-1 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ data?.totalSchedules.toString() || t('global.na') }}
            </h3>
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('global.schedule', data?.totalSchedules) }}
            </div>
          </div>
        </div>
        <div class="flex self-center">
          <router-link
            :to="Pages.SCHEDULES.path"
            class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            title="See"
            type="button"
          >
            <FontAwesomeIcon :icon="faChevronRight" class="!w-5 !h-5" />
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-span-full mb-2 xl:col-auto">
      <div
        class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
      >
        <div class="items-center flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
          <FontAwesomeIcon
            :icon="faClockRotateLeft"
            class="!w-16 !h-16 mr-2 dark:text-white"
          />
          <div class="flex-col pl-2">
            <div
              v-if="isFetching && !data"
              class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-16 mb-4"
            />
            <h3
              v-if="data"
              class="mb-1 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ data?.totalRestores.toString() || t('global.na') }}
            </h3>
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('global.restore', data?.totalRestores) }}
            </div>
          </div>
        </div>
        <div class="flex self-center">
          <router-link
            :to="Pages.RESTORES.path"
            class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            title="See"
            type="button"
          >
            <FontAwesomeIcon :icon="faChevronRight" class="!w-5 !h-5" />
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-span-full mb-2 xl:col-auto">
      <div
        class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
      >
        <div class="items-center flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
          <FontAwesomeIcon
            :icon="faServer"
            class="!w-16 !h-16 mr-2 dark:text-white"
          />
          <div class="flex-col pl-2">
            <div
              v-if="isFetching && !data"
              class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-16 mb-4"
            />
            <h3
              v-if="data"
              class="mb-1 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ data?.totalStorageLocations.toString() || t('global.na') }}
            </h3>
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('global.storageLocation', data?.totalStorageLocations) }}
            </div>
          </div>
        </div>
        <div class="flex self-center">
          <router-link
            :to="Pages.STORAGE_LOCATIONS.path"
            class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            title="See"
            type="button"
          >
            <FontAwesomeIcon :icon="faChevronRight" class="!w-5 !h-5" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  faChevronRight,
  faClock,
  faClockRotateLeft,
  faFloppyDisk,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useStatsBasic } from '@velero-ui-app/composables/stats/useStatsBasic';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { isFetching, data } = useStatsBasic();
</script>
