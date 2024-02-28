<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center">
      <h3 class="text-xl font-semibold dark:text-white">Details</h3>
      <div
        v-if="!spec"
        class="ml-4 h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24"
      ></div>
      <div
        v-if="!spec"
        class="ml-4 h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24"
      ></div>
      <div class="ml-4">
        <img
          :title="spec?.repositoryType"
          :alt="spec?.repositoryType"
          v-if="spec?.repositoryType === V1BackupRepositoryType.Kopia"
          class="h-5 w-5"
          src="/src/assets/images/kopia.svg"
        />
        <img
          :title="spec?.repositoryType"
          :alt="spec?.repositoryType"
          v-if="spec?.repositoryType === V1BackupRepositoryType.Restic"
          class="h-5 w-5"
          src="/src/assets/images/restic.png"
        />
      </div>
      <router-link
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: spec?.backupStorageLocation,
          },
        }"
        v-if="spec?.backupStorageLocation"
        class="ml-4 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faServer" class="w-3 h-3 mr-1.5" />
        {{ spec?.backupStorageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
      <span
        v-if="spec?.maintenanceFrequency"
        class="ml-4 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faClock" class="w-3 h-3 mr-1.5" />
        {{ spec?.maintenanceFrequency }}</span
      >
    </div>
    <div v-if="!spec">
      <div
        class="mt-4 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24"
      ></div>
      <div
        class="mt-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48"
      ></div>
    </div>
    <div v-if="spec?.volumeNamespace" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >Volume Namespace</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec?.volumeNamespace
      }}</i>
    </div>
    <div v-if="spec?.resticIdentifier" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >Restic Identifier</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec?.resticIdentifier
      }}</i>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { V1BackupRepositorySpec } from '@velero-ui/velero';
import {
  faServer,
  faClock,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '../../utils/constants.utils';
import { V1BackupRepositoryType } from '@velero-ui/velero';

defineProps({
  spec: Object as PropType<V1BackupRepositorySpec>,
});
</script>
