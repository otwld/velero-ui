<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.details') }}
      </h3>
      <div
        v-if="!spec"
        class="ml-4 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      ></div>
      <div
        v-if="!spec"
        class="ml-4 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      ></div>
      <div class="ml-4">
        <img
          v-if="spec?.uploaderType === V1BackupRepositoryType.Kopia"
          :alt="spec?.uploaderType"
          :title="spec?.uploaderType"
          class="h-5 w-5"
          src="/src/assets/images/kopia.svg"
        />
        <img
          v-if="spec?.uploaderType === V1BackupRepositoryType.Restic"
          :alt="spec?.uploaderType"
          :title="spec?.uploaderType"
          class="h-5 w-5"
          src="/src/assets/images/restic.png"
        />
      </div>
      <router-link
        v-if="spec?.backupStorageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: spec?.backupStorageLocation,
          },
        }"
        class="ml-4 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faServer" class="w-3 h-3 mr-1.5" />
        {{ spec?.backupStorageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </div>
    <div v-if="!spec">
      <div
        class="mt-4 h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      ></div>
      <div
        class="mt-2 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48"
      ></div>
    </div>
    <div v-if="spec?.tags?.backup" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >{{ t('resource.spec.backup')}}</span
      >
      <div class="mt-1 text-xs">
        <router-link
          :to="{
            name: Pages.BACKUP.name,
            params: {
              name: spec?.tags?.backup,
            },
          }"
          class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
        >
          <FontAwesomeIcon :icon="faFloppyDisk" class="w-3 h-3 mr-1.5" />
          {{ spec?.tags?.backup }}
          <FontAwesomeIcon
            :icon="faArrowUpRightFromSquare"
            class="w-2 h-2 ml-1.5"
          />
        </router-link>
      </div>
    </div>
    <div v-if="spec?.node" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >{{ t('resource.spec.node')}}</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec?.node
      }}</i>
    </div>
    <div v-if="spec?.volume" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >{{ t('resource.spec.volume')}}</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec?.volume
      }}</i>
    </div>
    <div v-if="spec?.repoIdentifier" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.spec.resticIdentifier')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec?.repoIdentifier
      }}</i>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type {
  V1PodVolumeBackupSpec,
  V1PodVolumeRestoreSpec,
} from '@velero-ui/velero';
import { V1BackupRepositoryType } from '@velero-ui/velero';
import {
  faArrowUpRightFromSquare, faDatabase, faFloppyDisk,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '../../utils/constants.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  spec: Object as PropType<V1PodVolumeBackupSpec | V1PodVolumeRestoreSpec>,
});
</script>
