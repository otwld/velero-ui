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
          v-if="data && data.length >= 0"
          class="ml-4 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
        >
          <FontAwesomeIcon :icon="faCubes" class="w-3 h-3 mr-1.5" />
          {{ data.length }}</span
        >
      </div>
      <ul class="overflow-auto mt-2 max-h-[300px]">
        <div v-if="data && data.length === 0 && isFetching">
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
import { Resources } from '@velero-ui/velero';
import { type Router, useRouter } from 'vue-router';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import PodVolumeLine from '@velero-ui-app/components/PodVolume/PodVolumeShortLine.vue';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { t } = useI18n();
const router: Router = useRouter();

const type =
  router.currentRoute.value.name === Pages.BACKUP.name
    ? Resources.POD_VOLUME_BACKUP
    : Resources.POD_VOLUME_RESTORE;

const listStore = useListStore();
listStore.setObjectType(type);
listStore.applyNameFilter(router.currentRoute.value.params.name as string);

const { on, off, data, error, isFetching } = useKubernetesWatchListObject(type);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
