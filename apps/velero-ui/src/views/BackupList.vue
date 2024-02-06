<template>
  <List
    v-if="backups"
    :component="BackupLine"
    :data="backups"
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
import { onBeforeMount } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import { storeToRefs } from 'pinia';
import List from '../components/List.vue';
import BackupLine from '../components/Backup/BackupLine.vue';

const backupStore = useBackupStore();
const { backups, total, offset, limit } = storeToRefs(backupStore);

const headers = ['Name', 'Schedule', 'Date', 'Expire in', 'Status', 'Actions'];

onBeforeMount(() => backupStore.fetch());

const onSearchInput = (value) => backupStore.applyNameFilter(value);
const onNext = () => backupStore.next();
const onPrevious = () => backupStore.previous();
const onRefresh = () => backupStore.fetch();
</script>
