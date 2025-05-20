<template>
  <ResourceStatus :is-loading="!location">
    <template #badges>
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
    </template>
    <template #content>
      <div v-if="location?.status?.lastSyncedTime" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.lastSyncedTime')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          convertTimestampToDate(location?.status.lastSyncedTime)
        }}</i>
      </div>
      <div
        v-if="location?.status?.lastValidationTime"
        class="mt-4 flex flex-col"
      >
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
    </template>
  </ResourceStatus>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import { V1BackupStorageLocationPhase } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { useI18n } from 'vue-i18n';
import ResourceStatus from '@velero-ui-app/components/Resource/ResourceStatus.vue';

const { t } = useI18n();
defineProps({
  location: {
    type: Object as PropType<V1BackupStorageLocation>,
    required: true,
  },
});
</script>
<script lang="ts" setup></script>
