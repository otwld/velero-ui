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
import { onBeforeMount } from 'vue';
import List from '@velero-ui-app/components/List/List.vue';
import { useDownloadRequestGetMany } from '@velero-ui-app/use/download-request/useDownloadRequestGetMany';
import DownloadRequestLine from '@velero-ui-app/components/Request/DownloadRequestLine.vue';

const { getMany, isGettingMany, downloadRequests } =
  useDownloadRequestGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Target', 'Kind', 'Expire In', 'Status', 'Actions'];
</script>
