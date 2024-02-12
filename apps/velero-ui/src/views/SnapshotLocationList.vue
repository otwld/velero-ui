<template>
  <List
    v-if="locations"
    :component="SnapshotLocationLine"
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
import List from '../components/List/List.vue';
import { storeToRefs } from 'pinia';
import { useSnapshotLocationStore } from '../stores/snapshot-location';
import SnapshotLocationLine from '../components/SnapshotLocation/SnapshotLocationLine.vue';
import { onBeforeMount } from 'vue';

const snapshotLocationStore = useSnapshotLocationStore();
const { locations, total, offset, limit } = storeToRefs(snapshotLocationStore);

const headers = ['Name', 'Provider', 'Status', 'Actions'];

onBeforeMount(() => snapshotLocationStore.fetch());

const onSearchInput = (value) => snapshotLocationStore.applyNameFilter(value);
const onNext = () => snapshotLocationStore.next();
const onPrevious = () => snapshotLocationStore.previous();
const onRefresh = () => snapshotLocationStore.fetch();
</script>
