<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <SnapshotLocationActions :location="data"></SnapshotLocationActions>
    </div>
    <div class="col-span-2">
      <Describe :data="data"></Describe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Describe from '@velero-ui-app/components/Describe.vue';
import SnapshotLocationActions from '@velero-ui-app/components/SnapshotLocation/SnapshotLocationActions.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { useKubernetesObject } from '@velero-ui-app/composables/useKubernetesObject';
import { Resources, type V1VolumeSnapshotLocation } from '@velero-ui/velero';

const router: Router = useRouter();

const { data } = useKubernetesObject<V1VolumeSnapshotLocation>(
  Resources.VOLUME_SNAPSHOT_LOCATION,
  router.currentRoute.value.params.name,
);
</script>
