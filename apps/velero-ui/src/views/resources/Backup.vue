<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <BackupActions :backup="data"></BackupActions>
        <BackupStatus :backup="data"></BackupStatus>
        <BackupDetails :spec="data?.spec"></BackupDetails>
      </div>
      <div class="col-span-2">
        <Describe :data="data"></Describe>
      </div>
    </div>
    <Logs
      :data="logs"
      :loading="isGettingLogs"
      :name="data?.metadata?.name"
      :type="V1DownloadTargetKind.BackupLog"
      class="pb-6"
    ></Logs>
  </div>
</template>

<script lang="ts" setup>
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';

import {
  Resources,
  type V1Backup,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { onBeforeMount, toRef } from 'vue';
import BackupActions from '@velero-ui-app/components/Backup/BackupActions.vue';
import BackupStatus from '@velero-ui-app/components/Backup/BackupStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import Logs from '@velero-ui-app/components/Logs.vue';
import { useLogsGet } from '@velero-ui-app/use/useLogsGet';
import { useKubernetesObject } from '@velero-ui-app/composables/useKubernetesObject';

const router: Router = useRouter();

const { data } = useKubernetesObject<V1Backup>(
  Resources.BACKUP,
  router.currentRoute.value.params.name,
);
const {
  get: getLogs,
  logs,
  isGetting: isGettingLogs,
} = useLogsGet(
  toRef(router.currentRoute.value.params.name),
  toRef(() => V1DownloadTargetKind.BackupLog),
);

onBeforeMount(() => getLogs());
</script>
