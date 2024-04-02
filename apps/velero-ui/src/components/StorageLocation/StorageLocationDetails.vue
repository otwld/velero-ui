<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center">
      <h3 class="text-xl font-semibold dark:text-white">Details</h3>
      <div
        v-if="!location"
        class="ml-4 h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24"
      ></div>
      <div
        v-if="!location"
        class="ml-4 h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24"
      ></div>
      <span
        v-if="location?.spec?.default"
        class="ml-4 bg-green-100 text-green-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
      >
        <FontAwesomeIcon :icon="faStar" class="w-3 h-3 mr-1.5" />
        Default</span
      >
      <span
        v-if="location?.spec?.accessMode"
        class="ml-4 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        {{ location.spec.accessMode }}</span
      >
    </div>
    <div v-if="!location">
      <div
        class="mt-4 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24"
      ></div>
      <div
        class="mt-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48"
      ></div>
    </div>
    <div v-if="location?.spec?.provider" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >Provider</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        location?.spec?.provider
      }}</i>
    </div>
    <div v-if="location?.spec?.backupSyncPeriod" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >Synchronization Period</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        location?.spec?.backupSyncPeriod
      }}</i>
    </div>
    <div v-if="location?.spec?.validationFrequency" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >Validation Frequency</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        location?.spec?.validationFrequency
      }}</i>
    </div>
    <div
      v-if="location?.spec?.objectStorage?.bucket"
      class="mt-4 flex flex-col"
    >
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >Object Storage Bucket</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        location?.spec?.objectStorage.bucket
      }}</i>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  location: Object as PropType<V1BackupStorageLocation>,
});
</script>
