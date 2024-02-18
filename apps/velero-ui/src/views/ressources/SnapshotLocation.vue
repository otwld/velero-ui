<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <SnapshotLocationActions :location="location"></SnapshotLocationActions>
    </div>
    <div class="col-span-2">
      <Describe :data="location"></Describe>
    </div>
  </div>
</template>

<script setup lang="ts">
import Describe from '@velero-ui-app/components/Describe.vue';
import SnapshotLocationActions from '@velero-ui-app/components/SnapshotLocation/SnapshotLocationActions.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { useSnapshotLocationStore } from '@velero-ui-app/stores/snapshot-location';
import { onBeforeMount, toRef } from 'vue';
import { useSnapshotLocationGet } from '@velero-ui-app/use/snapshot-location/useSnapshotLocationGet';

const snapshotLocationStore = useSnapshotLocationStore();
const { location } = storeToRefs(snapshotLocationStore);

const router: Router = useRouter();

const { get } = useSnapshotLocationGet(
  toRef(router.currentRoute.value.params.name)
);

onBeforeMount(() => get());
</script>
