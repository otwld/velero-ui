<template>
  <List
    v-if="locations"
    :component="SnapshotLocationLine"
    :data="locations"
    :loading="isGettingMany"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import List from '@velero-ui-app/components/List/List.vue';
import { storeToRefs } from 'pinia';
import { useSnapshotLocationStore } from '@velero-ui-app/stores/snapshot-location.store';
import SnapshotLocationLine from '@velero-ui-app/components/SnapshotLocation/SnapshotLocationLine.vue';
import { onBeforeMount } from 'vue';
import { useSnapshotLocationGetMany } from '@velero-ui-app/use/snapshot-location/useSnapshotLocationGetMany';

const snapshotLocationStore = useSnapshotLocationStore();
const { locations } = storeToRefs(snapshotLocationStore);

const { getMany, isGettingMany } = useSnapshotLocationGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Provider', 'Status', 'Actions'];
</script>
