<template>
  <div v-if="!error" class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <SnapshotLocationActions :location="data" />
      </div>
      <div class="col-span-2">
        <Describe :data="data" />
      </div>
    </div>
  </div>
  <ResourceNotFound v-if="error" :page="Pages.SNAPSHOT_LOCATIONS" />
</template>

<script lang="ts" setup>
import Describe from '@velero-ui-app/components/Describe.vue';
import SnapshotLocationActions from '@velero-ui-app/components/SnapshotLocation/SnapshotLocationActions.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { Resources, type V1VolumeSnapshotLocation } from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import ResourceNotFound from '@velero-ui-app/components/ResourceNotFound.vue';

const router: Router = useRouter();

const { on, off, data, error } =
  useKubernetesWatchObject<V1VolumeSnapshotLocation>(
    Resources.VOLUME_SNAPSHOT_LOCATION,
    router.currentRoute.value.params.name as string,
  );

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
