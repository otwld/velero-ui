<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <StorageLocationActions :location="location"></StorageLocationActions>
    </div>
    <div class="col-span-2">
      <Describe :data="location"></Describe>
    </div>
  </div>
</template>

<script setup lang="ts">
import Describe from '../components/Describe.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { useStorageLocationStore } from '../stores/storage-location.store';
import StorageLocationActions from '../components/StorageLocation/StorageLocationActions.vue';
import { onBeforeMount } from 'vue';

const storageLocationStore = useStorageLocationStore();
const { location } = storeToRefs(storageLocationStore);

const router: Router = useRouter();

onBeforeMount(() =>
  storageLocationStore.get(router.currentRoute.value.params.name)
);
</script>
