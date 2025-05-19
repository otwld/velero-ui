<template>
  <div v-if="!error" class="min-h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <BackupActions :backup="data" />
        <BackupStatus :backup="data" />
        <BackupDetails :spec="data?.spec" />
      </div>
      <div class="col-span-2">
        <Describe :data="data" />
      </div>
    </div>
    <PodVolumes v-if="can(Action.Read, Resources.POD_VOLUME_BACKUP.plural)" />
    <Logs
      v-if="can(Action.Logs, Resources.BACKUP.plural)"
      :data="logs"
      :loading="isLoading"
      :name="data?.metadata?.name"
      :type="V1DownloadTargetKind.BackupLog"
      class="pb-6"
    />
  </div>
  <ResourceNotFound v-if="error" :page="Pages.BACKUPS" />
</template>

<script lang="ts" setup>
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';

import {
  Resources,
  type V1Backup,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import BackupActions from '@velero-ui-app/components/Backup/BackupActions.vue';
import BackupStatus from '@velero-ui-app/components/Backup/BackupStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import Logs from '@velero-ui-app/components/Logs.vue';
import { useLogsGet } from '@velero-ui-app/composables/useLogsGet';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import ResourceNotFound from '@velero-ui-app/components/ResourceNotFound.vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import PodVolumes from '@velero-ui-app/components/PodVolume/PodVolumes.vue';
import { Action } from '@velero-ui/shared-types';
import { can } from '@velero-ui-app/utils/policy.utils';

const router: Router = useRouter();

const { on, off, data, error } = useKubernetesWatchObject<V1Backup>(
  Resources.BACKUP,
  router.currentRoute.value.params.name as string
);

const {
  get: getLogs,
  logs,
  isLoading,
} = useLogsGet(
  router.currentRoute.value.params.name as string,
  V1DownloadTargetKind.BackupLog
);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
onBeforeMount(
  (): Promise<void> =>
    can(Action.Logs, Resources.BACKUP.plural) ? getLogs() : void 0
);
</script>
