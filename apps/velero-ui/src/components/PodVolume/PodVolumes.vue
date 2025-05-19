<template>
  <div class="grid grid-cols-1 px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flex items-center">
        <h3 class="text-xl font-semibold dark:text-white">
          {{ t('podVolumes.title') }}
        </h3>
        <div
          v-if="data && data.length === 0 && isFetching"
          class="ml-4 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-12"
        />
        <span
          v-else
          class="ml-4 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
        >
          <FontAwesomeIcon :icon="faCubes" class="!w-3 !h-3 mr-1.5" />
          {{ data.length }}
        </span>
        <div
          v-if="data && data.length === 0 && isFetching"
          class="ml-4 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-12"
        />
        <span
          v-else
          class="ml-4 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
        >
          <FontAwesomeIcon :icon="faSquareBinary" class="!w-3 !h-3 mr-1.5" />
          {{ convertBytes(totalPodVolumesSize || 0) }}
        </span>
      </div>
      <ul class="overflow-auto mt-2 pr-2 max-h-[300px]">
        <template v-if="data && data.length === 0 && isFetching">
          <div v-for="index of 3" :key="index" class="py-2">
            <div
              class="ml-4 h-3 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-96"
            />
            <div
              class="ml-4 mt-2 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
            />
            <div
              class="ml-4 mt-2 h-3 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48"
            />
          </div>
        </template>
        <PodVolumeLine
          v-for="(pod, index) of data"
          :key="index"
          :pod-volume="pod"
        />
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  Resources,
  type V1PodVolumeBackup,
  type V1PodVolumeBackupList,
  type V1PodVolumeRestore,
  type V1PodVolumeRestoreList,
} from '@velero-ui/velero';
import { type Router, useRouter } from 'vue-router';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import PodVolumeLine from '@velero-ui-app/components/PodVolume/PodVolumeShortLine.vue';
import { faCubes, faSquareBinary } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { convertBytes } from '@velero-ui-app/utils/string.utils';

const { t } = useI18n();
const router: Router = useRouter();

const type =
  router.currentRoute.value.name === Pages.BACKUP.name
    ? Resources.POD_VOLUME_BACKUP
    : Resources.POD_VOLUME_RESTORE;

const listStore = useListStore();
listStore.setObjectType(type);
listStore.applyNameFilter(router.currentRoute.value.params.name as string);

const { on, off, data, error, isFetching } = useKubernetesWatchListObject<
  V1PodVolumeBackup | V1PodVolumeRestore,
  V1PodVolumeBackupList | V1PodVolumeRestoreList
>(type);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());

const totalPodVolumesSize = computed(() =>
  data.value?.reduce(
    (accumulator: number, podVolume: V1PodVolumeBackup | V1PodVolumeRestore) =>
      accumulator + (podVolume.status?.progress?.bytesDone || 0),
    0
  )
);
</script>
