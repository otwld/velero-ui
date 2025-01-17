<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center flex-wrap gap-x-4">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.status') }}
      </h3>
      <div
        v-if="!podVolume"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <PodVolumePhaseBadge :status="podVolume?.status?.phase" />
    </div>
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
          >{{ convertBytes(podVolume.status.progress?.bytesDone) || '0' }} /
          {{
            convertBytes(podVolume.status.progress?.totalBytes) || '0'
          }}</span
        >
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div :style="getPercent()" class="bg-blue-600 h-2.5 rounded-full"></div>
      </div>
    </div>
    <div v-if="!podVolume" class="mt-4">
      <div class="flex items-center justify-between mb-1">
        <div
          class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
        />
        <div
          class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
        />
      </div>
      <div
        class="w-full bg-gray-200 rounded-full animate-pulse h-2.5 dark:bg-gray-700"
      ></div>
    </div>
    <div v-if="podVolume?.status?.message" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">
        {{
          t('resource.status.message')
        }}
      </span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          podVolume.status.message
        }}</i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1PodVolumeBackup, V1PodVolumeRestore } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';
import PodVolumePhaseBadge from '@velero-ui-app/components/PodVolume/PodVolumePhaseBadge.vue';
import { convertBytes } from '@velero-ui-app/utils/string.utils';
import { convertTimestampToDate } from '@velero-ui-app/utils/date.utils';

const { t } = useI18n();
const props = defineProps({
  podVolume: Object as PropType<V1PodVolumeBackup | V1PodVolumeRestore>,
});

const getPercent = () => {
  const percent = Math.round(
    ((props.podVolume?.status?.progress?.bytesDone || 0) * 100) /
      props.podVolume?.status?.progress?.totalBytes,
  );
  return {
    width: `${percent}%`,
  };
};
</script>
