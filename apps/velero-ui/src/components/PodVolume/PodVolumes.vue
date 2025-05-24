<template>
  <div class="grid grid-cols-1 px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flex items-center">
        <h3 class="text-xl font-semibold dark:text-white">
          {{ t('podVolumes.title') }}
        </h3>
        <Skeleton
          v-if="data && data.length === 0 && isFetching"
          class="ml-4"
          width="12"
        />
        <Badge
          v-else
          :prefix-icon="faCubes"
          :text="data.length.toString()"
          class="ml-4"
          color="blue"
        />
        <Skeleton
          v-if="data && data.length === 0 && isFetching"
          class="ml-4"
          width="12"
        />
        <Badge
          v-else
          :prefix-icon="faSquareBinary"
          :text="convertBytes(totalPodVolumesSize || 0)"
          class="ml-4"
          color="blue"
        />
      </div>
      <div class="overflow-auto mt-2 pr-2 max-h-[300px]">
        <template v-if="data && data.length === 0 && isFetching">
          <div v-for="index of 3" :key="index" class="py-2">
            <Skeleton class="ml-4" height="3" width="96" />
            <Skeleton class="ml-4 mt-2" width="24" />
            <Skeleton class="ml-4 mt-2" height="3" width="48" />
          </div>
        </template>
        <PodVolumeLine
          v-for="(pod, index) of data"
          :key="index"
          :pod-volume="pod"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  Resources,
  type V1PodVolumeBackup,
  type V1PodVolumeRestore,
} from '@velero-ui/velero';
import { type Router, useRouter } from 'vue-router';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import PodVolumeLine from '@velero-ui-app/components/PodVolume/PodVolumeShortLine.vue';
import { faCubes, faSquareBinary } from '@fortawesome/free-solid-svg-icons';
import { convertBytes } from '@velero-ui-app/utils/string.utils';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import Badge from '@velero-ui-app/components/Badge.vue';
import { useFilters } from '@velero-ui-app/composables/search/useFilters';
import { Filter } from '@velero-ui/shared-types';

const { t } = useI18n();
const router: Router = useRouter();
const { set } = useFilters();

const type =
  router.currentRoute.value.name === Pages.BACKUP.name
    ? Resources.POD_VOLUME_BACKUP
    : Resources.POD_VOLUME_RESTORE;

const listStore = useListStore();
listStore.setObjectType(type);
set(Filter.Search, router.currentRoute.value.params.name as string, true);

const { on, off, data, error, isFetching } = useKubernetesWatchListObject<
  V1PodVolumeBackup | V1PodVolumeRestore
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
