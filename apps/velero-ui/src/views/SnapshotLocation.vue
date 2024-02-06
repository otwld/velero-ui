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
import Describe from '../components/Describe.vue';
import SnapshotLocationActions from '../components/SnapshotLocation/SnapshotLocationActions.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { useSnapshotLocationStore } from '../stores/snapshot-location';
import { onBeforeMount } from 'vue';

const snapshotLocationStore = useSnapshotLocationStore();
const { location } = storeToRefs(snapshotLocationStore);

const router: Router = useRouter();

onBeforeMount(() =>
  snapshotLocationStore.get(router.currentRoute.value.params.name)
);
</script>
