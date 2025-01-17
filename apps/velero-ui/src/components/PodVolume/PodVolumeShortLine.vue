<template>
  <div class="flex items-center mb-4 gap-x-4 gap-y-2">
    <div class="flex items-center">
      <FontAwesomeIcon :icon="faCube" class="w-6 h-6 dark:text-white" />
    </div>
    <div class="flex-1 min-w-0">
      <div
        class="flex items-center text-base font-semibold text-gray-900 truncate dark:text-white"
      >
        {{ podVolume?.spec?.pod.name }}
        <PodVolumePhaseBadge :status="podVolume?.status.phase" class="ml-4" />
      </div>
      <p class="text-sm font-normal text-gray-500 truncate dark:text-gray-400">
        {{ podVolume?.spec?.tags?.volume }}
      </p>
      <div v-if="podVolume?.status.progress" class="mt-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-gray-900 dark:text-white">{{
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
          <div
            :style="getPercent()"
            class="bg-blue-600 h-2.5 rounded-full"
          ></div>
        </div>
      </div>
    </div>
    <div class="inline-flex items-center">
      <router-link
        :title="podVolume?.spec?.pod.name"
        :to="{
          name: Pages.POD_VOLUME_BACKUP.name,
          params: {
            name: podVolume?.metadata?.name,
          },
        }"
        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-center text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="w-4 h-4" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  faArrowUpRightFromSquare,
  faCube,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { useI18n } from 'vue-i18n';
import type { PropType } from 'vue';
import type { V1PodVolumeBackup, V1PodVolumeRestore } from '@velero-ui/velero';
import PodVolumePhaseBadge from '@velero-ui-app/components/PodVolume/PodVolumePhaseBadge.vue';
import { convertBytes } from '@velero-ui-app/utils/string.utils';
import { Pages } from '@velero-ui-app/utils/constants.utils';

const { t } = useI18n();
const props = defineProps({
  podVolume: Object as PropType<V1PodVolumeBackup | V1PodVolumeRestore>,
});

const getPercent = () => {
  const percent = Math.round(
    ((props.podVolume?.status.progress.bytesDone || 0) * 100) /
      props.podVolume?.status.progress.totalBytes,
  );
  return {
    width: `${percent}%`,
  };
};
</script>
