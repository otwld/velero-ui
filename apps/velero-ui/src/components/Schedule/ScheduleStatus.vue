<template>
  <ResourceStatus :is-loading="!schedule">
    <template #badges>
      <ScheduleStatusPhaseBadge :status="schedule?.status?.phase" />
      <Badge
        v-if="schedule?.spec?.paused"
        :text="t('global.paused')"
        color="yellow"
      />
      <Badge
        v-if="schedule?.spec.schedule"
        :prefix-icon="faCalendar"
        :text="`${veleroCron.timezone ?? ''} ${veleroCron?.cron}`"
        color="blue"
      />
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
import { computed, type PropType } from 'vue';
import type { V1Schedule } from '@velero-ui/velero';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import ScheduleStatusPhaseBadge from './ScheduleStatusPhaseBadge.vue';
import { convertTimestampToDate, parseVeleroCron } from '../../utils/date.utils';
import { useI18n } from 'vue-i18n';
import Badge from '@velero-ui-app/components/Badge.vue';
import ResourceStatus from "@velero-ui-app/components/Resource/ResourceStatus.vue";

const { t } = useI18n();
const props = defineProps({
  schedule: { type: Object as PropType<V1Schedule>, required: true },
});

const veleroCron = computed(() => parseVeleroCron(props.schedule?.spec?.schedule));
</script>
