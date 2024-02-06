<template>
  <List
    v-if="locations"
    :component="StorageLocationLine"
    :data="locations"
    :headers="headers"
    :offset="offset"
    :limit="limit"
    :total="total"
    @onSearchInput="onSearchInput"
    @onNext="onNext"
    @onPrevious="onPrevious"
    @onRefresh="onRefresh"
  ></List>
</template>
<script setup lang="ts">
import List from '../components/List.vue';
import { storeToRefs } from 'pinia';
import { useStorageLocationStore } from '../stores/storage-location.store';
import StorageLocationLine from '../components/StorageLocation/StorageLocationLine.vue';
import { onBeforeMount } from 'vue';

const storageLocationStore = useStorageLocationStore();
const { locations, total, offset, limit } = storeToRefs(storageLocationStore);

const headers = ['Name', 'Provider', 'Last Sync', 'Status', 'Actions'];

onBeforeMount(() => storageLocationStore.fetch());

const onSearchInput = (value) => storageLocationStore.applyNameFilter(value);
const onNext = () => storageLocationStore.next();
const onPrevious = () => storageLocationStore.previous();
const onRefresh = () => storageLocationStore.fetch();
</script>
