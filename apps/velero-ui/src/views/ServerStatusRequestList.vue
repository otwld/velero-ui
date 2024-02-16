<template>
  <List
    v-if="serverStatusRequests"
    :component="ServerStatusRequestLine"
    :data="serverStatusRequests"
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
import { useServerStatusRequestGetMany } from '@velero-ui-app/use/server-status-request/useServerStatusRequestGetMany';
import ServerStatusRequestLine from '@velero-ui-app/components/Request/ServerStatusRequestLine.vue';

const listStore = useListStore();
const { offset, filters } = storeToRefs(listStore);

const { getMany, isGettingMany, serverStatusRequests } =
  useServerStatusRequestGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Processed On', 'Status', 'Actions'];

watch(offset, () => getMany());
watch(filters, () => getMany(), {
  deep: true,
});
</script>
