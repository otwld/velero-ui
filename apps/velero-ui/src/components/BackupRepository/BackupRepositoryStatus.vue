<template>
  <ResourceStatus :is-loading="!repository">
    <template #badges>
      <Badge
        v-if="repository?.status?.phase === V1BackupRepositoryPhase.Ready"
        :text="t('resource.phase.Ready')"
        color="green"
      />
      <Badge
        v-if="repository?.status?.phase === V1BackupRepositoryPhase.NotReady"
        :text="t('resource.phase.NotReady')"
        color="red"
      />
      <Badge
        v-if="repository?.status?.phase === V1BackupRepositoryPhase.New"
        :text="t('resource.phase.New')"
        color="blue"
      />
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
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Badge from "@velero-ui-app/components/Badge.vue";

const { t } = useI18n();
defineProps({
  repository: { type: Object as PropType<V1BackupRepository>, required: true },
});
</script>
