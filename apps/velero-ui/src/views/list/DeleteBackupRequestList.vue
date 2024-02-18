<template>
  <List
    v-if="deleteBackupRequests"
    :component="DeleteBackupRequestLine"
    :data="deleteBackupRequests"
    :loading="isGettingMany"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue';
import List from '@velero-ui-app/components/List/List.vue';
import { useDeleteBackupRequestGetMany } from '@velero-ui-app/use/delete-backup-request/useDeleteBackupRequestGetMany';
import DeleteBackupRequestLine from '@velero-ui-app/components/Request/DeleteBackupRequestLine.vue';

const { getMany, isGettingMany, deleteBackupRequests } =
  useDeleteBackupRequestGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Target', 'Status', 'Actions'];
</script>
