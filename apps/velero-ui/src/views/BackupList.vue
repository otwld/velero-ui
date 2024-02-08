<template>
  <List
    v-if="backups"
    :component="BackupLine"
    :data="backups"
    :loading="isGettingMany"
    :headers="headers"
    :offset="offset"
    :limit="limit"
    :total="total"
    @onSearchInput="onSearchInput"
    @onNext="onNext"
    @onPrevious="onPrevious"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import { storeToRefs } from 'pinia';
import List from '../components/List.vue';
import BackupLine from '../components/Backup/BackupLine.vue';
import { useBackupGetMany } from '../composables/backup/useBackupGetMany';

const backupStore = useBackupStore();
const { backups, total, offset, limit } = storeToRefs(backupStore);

const { getMany, isGettingMany } = useBackupGetMany();

onBeforeMount( () => getMany());

const headers = ['Name', 'Schedule', 'Date', 'Expire in', 'Status', 'Actions'];


const onSearchInput = (value) => backupStore.applyNameFilter(value);
const onNext = () => (backupStore.next(), getMany());
const onPrevious = () => (backupStore.previous(), getMany());

</script>
