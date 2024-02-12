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
import { onBeforeMount, watch } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import { storeToRefs } from 'pinia';
import List from '../components/List/List.vue';
import BackupLine from '../components/Backup/BackupLine.vue';
import { useListStore } from '../stores/list.store';
import { useBackupGetMany } from '@velero-ui-app/use/backup/useBackupGetMany';

const listStore = useListStore();
const { offset, filters } = storeToRefs(listStore);

const backupStore = useBackupStore();
const { backups } = storeToRefs(backupStore);

const { getMany, isGettingMany } = useBackupGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Schedule', 'Date', 'Expire in', 'Status', 'Actions'];

watch(offset, () => getMany());
watch(filters, () => getMany(), {
  deep: true,
});
</script>
