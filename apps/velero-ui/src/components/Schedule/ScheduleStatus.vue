<template>
  <ResourceStatus :is-loading="!schedule">
    <template #badges>
      <ScheduleStatusPhaseBadge :status="schedule?.status?.phase" />
      <span
        v-if="schedule?.spec?.paused"
        class="bg-yellow-100 text-yellow-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
      >
        <FontAwesomeIcon :icon="faPause" class="!w-3 !h-3 mr-1.5" />
        {{ t('global.paused') }}
      </span>
      <span
        v-if="schedule?.spec.schedule"
        class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faCalendar" class="!w-3 !h-3 mr-1.5" />
        {{ schedule.spec.schedule }}
      </span>
    </template>
    <template #content>
      <div v-if="schedule?.status?.lastBackup" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.lastBackup')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          convertTimestampToDate(schedule.status.lastBackup)
        }}</i>
      </div>
      <div v-if="schedule?.status?.lastSkipped" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.lastSkipped')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          convertTimestampToDate(schedule.status.lastSkipped)
        }}</i>
      </div>
    </template>
  </ResourceStatus>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1Schedule } from '@velero-ui/velero';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendar, faPause } from '@fortawesome/free-solid-svg-icons';
import ScheduleStatusPhaseBadge from './ScheduleStatusPhaseBadge.vue';
import { convertTimestampToDate } from '../../utils/date.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  schedule: { type: Object as PropType<V1Schedule>, required: true },
});
</script>
<script lang="ts" setup></script>
