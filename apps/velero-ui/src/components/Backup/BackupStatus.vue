<template>
  <ResourceStatus :is-loading="!backup">
    <template #badges>
      <BackupStatusPhaseBadge :status="backup?.status?.phase" />
      <Badge
        v-if="backup?.status?.errors"
        :prefix-icon="faCircleExclamation"
        :text="backup.status.errors.toString()"
        color="red"
      />
      <Badge
        v-if="backup?.status?.warnings"
        :prefix-icon="faTriangleExclamation"
        :text="backup.status.warnings.toString()"
        color="orange"
      />
      <Badge
        v-if="backup?.status?.expiration"
        :prefix-icon="faHourglass"
        :text="getRemainingTime(backup.status.expiration)"
        color="blue"
      />
    </template>
    <template #content>
      <div
        v-if="backup?.status?.completionTimestamp && backup?.status?.startTimestamp"
        class="mt-4 flex flex-col"
      >
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.duration')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          getTime(Date.parse(backup.status.completionTimestamp) - Date.parse(backup.status.startTimestamp))
        }}</i>
      </div>
      <div v-if="backup?.status?.progress" class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base font-medium text-gray-900 dark:text-white">{{
            t('resource.status.items')
          }}</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white"
            >{{ backup.status.progress.itemsBackedUp || '0' }} /
            {{ backup.status.progress.totalItems }}</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div :style="getPercent()" class="bg-blue-600 h-2.5 rounded-full" />
        </div>
      </div>
      <div v-if="!backup" class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <Skeleton />
          <Skeleton />
        </div>
        <Skeleton height="2.5" width="full" />
      </div>
      <div v-if="backup?.status?.failureReason" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.reason')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          backup.status.failureReason
        }}</i>
      </div>
      <div v-if="backup?.status?.validationErrors" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.validationErrors')
        }}</span>
        <i
          v-for="(error, index) of backup.status.validationErrors"
          :key="index"
          class="mt-1 text-xs text-gray-500 dark:text-gray-400"
        >
          - {{ error }}
        </i>
      </div>
    </template>
  </ResourceStatus>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1Backup } from '@velero-ui/velero';
import { convertTimestampToDate, getRemainingTime, getTime } from '../../utils/date.utils';
import BackupStatusPhaseBadge from './BackupStatusPhaseBadge.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleExclamation, faClock,
  faHourglass,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import ResourceStatus from '@velero-ui-app/components/Resource/ResourceStatus.vue';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import Badge from "@velero-ui-app/components/Badge.vue";

const { t } = useI18n();
const props = defineProps({
  backup: { type: Object as PropType<V1Backup>, required: true },
});

const getPercent = () => {
  const percent = Math.round(
    ((props.backup?.status.progress.itemsBackedUp || 0) * 100) /
      props.backup?.status.progress.totalItems
  );
  return {
    width: `${percent}%`,
  };
};
</script>
