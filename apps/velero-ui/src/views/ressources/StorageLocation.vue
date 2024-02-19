<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <StorageLocationActions :location="location"></StorageLocationActions>
      <StorageLocationStatus :location="location"></StorageLocationStatus>
      <StorageLocationDetails :location="location"></StorageLocationDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="location"></Describe>
    </div>
  </div>
</template>

<script setup lang="ts">
import Describe from '@velero-ui-app/components/Describe.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { useStorageLocationStore } from '@velero-ui-app/stores/storage-location.store';
import StorageLocationActions from '@velero-ui-app/components/StorageLocation/StorageLocationActions.vue';
import { onBeforeMount, toRef } from 'vue';
import { useStorageLocationGet } from '@velero-ui-app/use/storage-location/useStorageLocationGet';
import StorageLocationStatus from '@velero-ui-app/components/StorageLocation/StorageLocationStatus.vue';
import StorageLocationDetails from '@velero-ui-app/components/StorageLocation/StorageLocationDetails.vue';

const storageLocationStore = useStorageLocationStore();
const { location } = storeToRefs(storageLocationStore);

const router: Router = useRouter();

const { get } = useStorageLocationGet(
  toRef(router.currentRoute.value.params.name)
);

onBeforeMount(() => get());
</script>
