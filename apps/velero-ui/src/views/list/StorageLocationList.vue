<template>
  <List
    v-if="locations"
    :component="StorageLocationLine"
    :data="locations"
    :headers="headers"
    :loading="isGettingMany"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import List from '@velero-ui-app/components/List/List.vue';
import { storeToRefs } from 'pinia';
import { useStorageLocationStore } from '@velero-ui-app/stores/storage-location.store';
import StorageLocationLine from '@velero-ui-app/components/StorageLocation/StorageLocationLine.vue';
import { onBeforeMount } from 'vue';
import { useStorageLocationGetMany } from '@velero-ui-app/use/storage-location/useStorageLocationGetMany';

const storageLocationStore = useStorageLocationStore();
const { locations } = storeToRefs(storageLocationStore);

const { getMany, isGettingMany } = useStorageLocationGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Provider', 'Access Mode', 'Last Sync', 'Status', 'Actions'];
</script>
