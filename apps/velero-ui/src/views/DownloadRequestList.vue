<template>
  <List
    v-if="downloadRequests"
    :component="DownloadRequestLine"
    :data="downloadRequests"
    :loading="isGettingMany"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { onBeforeMount, watch } from 'vue';
import List from '@velero-ui-app/components/List/List.vue';
import { useDownloadRequestGetMany } from '@velero-ui-app/use/download-request/useDownloadRequestGetMany';
import DownloadRequestLine from '@velero-ui-app/components/Request/DownloadRequestLine.vue';

const listStore = useListStore();
const { offset, filters } = storeToRefs(listStore);

const { getMany, isGettingMany, downloadRequests } =
  useDownloadRequestGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Target', 'Kind', 'Expire In', 'Status', 'Actions'];

watch(offset, () => getMany());
watch(filters, () => getMany(), {
  deep: true,
});
</script>
