<template>
  <ResourceStatus :is-loading="!podVolume">
    <template #badges>
      <PodVolumePhaseBadge :status="podVolume?.status?.phase" />
    </template>
    <template #content>
      <div v-if="podVolume?.status?.startTimestamp" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.startTime')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          convertTimestampToDate(podVolume.status.startTimestamp)
        }}</i>
      </div>
      <div
        v-if="podVolume?.status?.completionTimestamp"
        class="mt-4 flex flex-col"
      >
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.completionTime')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          convertTimestampToDate(podVolume.status.completionTimestamp)
        }}</i>
      </div>
      <div v-if="podVolume?.status?.progress" class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base font-medium text-gray-900 dark:text-white">{{
            t('resource.status.bytes')
          }}</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white"
            >{{ convertBytes(podVolume.status.progress.bytesDone) || '0' }} /
            {{
              convertBytes(podVolume.status.progress.totalBytes) || '0'
            }}</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div :style="getPercent()" class="bg-blue-600 h-2.5 rounded-full" />
        </div>
      </div>
      <div v-if="!podVolume" class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <Skeleton />
          <Skeleton />
        </div>
        <Skeleton height="2.5" width="full" />
      </div>
      <div v-if="podVolume?.status?.message" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">
          {{ t('resource.status.message') }}
        </span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          podVolume.status.message
        }}</i>
      </div>
    </template>
  </ResourceStatus>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1PodVolumeBackup, V1PodVolumeRestore } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';
import PodVolumePhaseBadge from '@velero-ui-app/components/PodVolume/PodVolumePhaseBadge.vue';
import { convertBytes } from '@velero-ui-app/utils/string.utils';
import { convertTimestampToDate } from '@velero-ui-app/utils/date.utils';
import ResourceStatus from '@velero-ui-app/components/Resource/ResourceStatus.vue';
import Skeleton from "@velero-ui-app/components/Skeleton.vue";

const { t } = useI18n();
const props = defineProps({
  podVolume: {
    type: Object as PropType<V1PodVolumeBackup | V1PodVolumeRestore>,
    required: true,
  },
});

const getPercent = () => {
  const percent = Math.round(
    ((props.podVolume?.status?.progress?.bytesDone || 0) * 100) /
      props.podVolume?.status?.progress?.totalBytes
  );
  return {
    width: `${percent}%`,
  };
};
</script>
<script lang="ts" setup></script>
