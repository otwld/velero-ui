<template>
  <List
    v-if="repositories"
    :component="BackupRepositoryLine"
    :data="repositories"
    :loading="isLoading"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import List from '@velero-ui-app/components/List/List.vue';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import { useBackupRepositoryStore } from '@velero-ui-app/stores/backup-repository.store';
import { useBackupRepositoryGetMany } from '@velero-ui-app/use/backup-repository/useBackupRepositoryGetMany';
import BackupRepositoryLine from '@velero-ui-app/components/BackupRepository/BackupRepositoryLine.vue';

const backupRepositoryStore = useBackupRepositoryStore();
const { repositories } = storeToRefs(backupRepositoryStore);

const { getMany, isLoading } = useBackupRepositoryGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Storage Location', 'Type', 'Last Maintenance Time', 'Status', 'Actions'];
</script>
