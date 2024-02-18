<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
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
      :data="logs"
      :name="backup?.metadata?.name"
      :loading="isGettingLogs"
      :type="V1DownloadTargetKind.BackupLog"
      class="pb-6"
    ></Logs>
  </div>
</template>

<script setup lang="ts">
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { V1DownloadTargetKind } from '@velero-ui/velero';
import { onBeforeMount, toRef } from 'vue';
import { useBackupStore } from '@velero-ui-app/stores/backup.store';
import { useBackupGet } from '@velero-ui-app/use/backup/useBackupGet';
import BackupActions from '@velero-ui-app/components/Backup/BackupActions.vue';
import BackupStatus from '@velero-ui-app/components/Backup/BackupStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import Logs from '@velero-ui-app/components/Logs.vue';
import { useLogsGet } from '@velero-ui-app/use/useLogsGet';

const backupStore = useBackupStore();
const { backup } = storeToRefs(backupStore);

const router: Router = useRouter();

const { get } = useBackupGet(toRef(router.currentRoute.value.params.name));

const {
  get: getLogs,
  logs,
  isGetting: isGettingLogs,
} = useLogsGet(
  toRef(router.currentRoute.value.params.name),
  toRef(() => V1DownloadTargetKind.BackupLog)
);

onBeforeMount(() => get());

onBeforeMount(() => getLogs());
</script>
