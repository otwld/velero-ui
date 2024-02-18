<template>
  <List
    v-if="backups"
    :component="BackupLine"
    :data="backups"
    :loading="isGettingMany"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useBackupStore } from '@velero-ui-app/stores/backup.store';
import { storeToRefs } from 'pinia';
import List from '@velero-ui-app/components/List/List.vue';
import BackupLine from '@velero-ui-app/components/Backup/BackupLine.vue';
import { useBackupGetMany } from '@velero-ui-app/use/backup/useBackupGetMany';

const backupStore = useBackupStore();
const { backups } = storeToRefs(backupStore);

const { getMany, isGettingMany } = useBackupGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Schedule', 'Date', 'Expire in', 'Status', 'Actions'];
</script>
