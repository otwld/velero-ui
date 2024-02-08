<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <BackupActions :backup="backup"></BackupActions>
      <BackupStatus :backup="backup"></BackupStatus>
      <BackupDetails :spec="backup?.spec"></BackupDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="backup"></Describe>
    </div>
  </div>
  <Logs
    :data="backupLogs"
    :name="backup?.metadata?.name"
    :type="V1DownloadTargetKind.BackupLog"
    class="pb-6"
  ></Logs>
</template>

<script setup lang="ts">
import { useBackupStore } from '../stores/backup.store';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import BackupActions from '../components/Backup/BackupActions.vue';
import Logs from '../components/Logs.vue';
import Describe from '../components/Describe.vue';
import BackupDetails from '../components/Backup/BackupDetails.vue';
import BackupStatus from '../components/Backup/BackupStatus.vue';
import { V1DownloadTargetKind } from '@velero-ui/velero';
import { onBeforeMount, toRef } from 'vue';
import { useBackupGet } from '../composables/backup/useBackupGet';

const backupStore = useBackupStore();
const { backup, backupLogs } = storeToRefs(backupStore);

const router: Router = useRouter();

const { get } = useBackupGet(
  toRef(router.currentRoute.value.params.name)
);

backupLogs.value = undefined;

onBeforeMount(() => get());

onBeforeMount(() => backupStore.logs(router.currentRoute.value.params.name));
</script>
