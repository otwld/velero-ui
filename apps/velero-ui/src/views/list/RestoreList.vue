<template>
  <List
    v-if="restores"
    :component="RestoreLine"
    :data="restores"
    :loading="isGettingMany"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import List from '@velero-ui-app/components/List/List.vue';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import { useRestoreGetMany } from '@velero-ui-app/use/restore/useRestoreGetMany';
import { useRestoreStore } from '@velero-ui-app/stores/restore.store';
import RestoreLine from '@velero-ui-app/components/Restore/RestoreLine.vue';

const restoreStore = useRestoreStore();
const { restores } = storeToRefs(restoreStore);

const { getMany, isGettingMany } = useRestoreGetMany();

onBeforeMount(() => getMany());

const headers = ['Name', 'Backup', 'Schedule', 'Status', 'Actions'];
</script>
