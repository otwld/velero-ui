<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.status') }}
      </h3>
      <div
        v-if="!repository"
        class="ml-4 h-2 bg-gray-200 rounded-full animate-pulsedark:bg-gray-700 w-24"
      ></div>
      <div
        v-if="!repository"
        class="ml-4 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      ></div>
      <span
        v-if="repository?.status?.phase === V1BackupRepositoryPhase.Ready"
        class="ml-4 bg-green-100 text-green-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
      >
        {{ t('resource.phase.Ready') }}
      </span>
      <span
        v-if="repository?.status?.phase === V1BackupRepositoryPhase.NotReady"
        class="ml-4 bg-red-100 text-red-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
      >
        {{ t('resource.phase.NotReady') }}
      </span>
      <span
        v-if="repository?.status?.phase === V1BackupRepositoryPhase.New"
        class="ml-4 bg-red-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        {{ t('resource.phase.New') }}
      </span>
    </div>
    <div
      v-if="repository?.status?.lastMaintenanceTime"
      class="mt-4 flex flex-col"
    >
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.lastMaintenanceTime')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        convertTimestampToDate(repository.status.lastMaintenanceTime)
      }}</i>
    </div>
    <div v-if="repository?.status?.message" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.message')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        repository.status.message
      }}</i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupRepository } from '@velero-ui/velero';
import { V1BackupRepositoryPhase } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  repository: Object as PropType<V1BackupRepository>,
});
</script>
