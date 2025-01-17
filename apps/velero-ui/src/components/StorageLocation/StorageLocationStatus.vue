<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center flex-wrap gap-x-4">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.status') }}
      </h3>
      <div
        v-if="!location"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <div
        v-if="!location"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <span
        v-if="
          location?.status?.phase === V1BackupStorageLocationPhase.Available
        "
        class="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
      >
        {{ location.status.phase }}
      </span>
      <span
        v-if="
          location?.status?.phase === V1BackupStorageLocationPhase.Unavailable
        "
        class="bg-red-100 text-red-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
      >
        {{ location.status.phase }}
      </span>
    </div>
    <div v-if="location?.status?.lastSyncedTime" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.lastSyncedTime')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        convertTimestampToDate(location?.status.lastSyncedTime)
      }}</i>
    </div>
    <div v-if="location?.status?.lastValidationTime" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.lastValidationTime')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        convertTimestampToDate(location.status.lastValidationTime)
      }}</i>
    </div>
    <div v-if="location?.status?.message" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.message')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        location?.status?.message
      }}</i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import { V1BackupStorageLocationPhase } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  location: Object as PropType<V1BackupStorageLocation>,
});
</script>
