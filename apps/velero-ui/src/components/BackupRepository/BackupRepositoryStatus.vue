<template>
  <ResourceStatus :is-loading="!repository">
    <template #badges>
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
    </template>
    <template #content>
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
    </template>
  </ResourceStatus>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupRepository } from '@velero-ui/velero';
import { V1BackupRepositoryPhase } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { useI18n } from 'vue-i18n';
import ResourceStatus from '@velero-ui-app/components/Resource/ResourceStatus.vue';

const { t } = useI18n();
defineProps({
  repository: { type: Object as PropType<V1BackupRepository>, required: true },
});
</script>
