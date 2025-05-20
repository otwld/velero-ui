<template>
  <ResourceStatus :is-loading="!location">
    <template #badges>
      <Badge
        v-if="
          location?.status?.phase === V1BackupStorageLocationPhase.Available
        "
        :text="location.status.phase"
        color="green"
      />
      <Badge
        v-if="
          location?.status?.phase === V1BackupStorageLocationPhase.Unavailable
        "
        :text="location.status.phase"
        color="red"
      />
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
import Badge from '@velero-ui-app/components/Badge.vue';

const { t } = useI18n();
defineProps({
  location: {
    type: Object as PropType<V1BackupStorageLocation>,
    required: true,
  },
});
</script>
<script lang="ts" setup></script>
