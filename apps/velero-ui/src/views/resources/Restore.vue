<template>
  <div v-if="!error" class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <RestoreActions :restore="data" />
        <RestoreStatus :restore="data" />
        <RestoreDetails :spec="data?.spec" />
      </div>
      <div class="col-span-2">
        <Describe :data="data" />
      </div>
    </div>
    <PodVolumes v-if="can(Action.Read, Resources.RESTORE.plural)" />
    <Logs
      v-if="can(Action.Logs, Resources.RESTORE.plural)"
      :data="logs"
      :loading="isLoading"
      :name="data?.metadata?.name"
      :type="V1DownloadTargetKind.RestoreLog"
      class="pb-6"
    />
  </div>
  <ResourceNotFound v-if="error" :page="Pages.RESTORES" />
</template>

<script lang="ts" setup>
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';

import {
  Resources,
  V1DownloadTargetKind,
  type V1Restore,
} from '@velero-ui/velero';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import Logs from '@velero-ui-app/components/Logs.vue';
import { useLogsGet } from '@velero-ui-app/composables/useLogsGet';
import RestoreActions from '@velero-ui-app/components/Restore/RestoreActions.vue';
import RestoreStatus from '@velero-ui-app/components/Restore/RestoreStatus.vue';
import RestoreDetails from '@velero-ui-app/components/Restore/RestoreDetails.vue';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import ResourceNotFound from '@velero-ui-app/components/ResourceNotFound.vue';
import PodVolumes from '@velero-ui-app/components/PodVolume/PodVolumes.vue';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';

const router: Router = useRouter();

const { on, off, data, error } = useKubernetesWatchObject<V1Restore>(
  Resources.RESTORE,
  router.currentRoute.value.params.name as string
);

const {
  get: getLogs,
  logs,
  isLoading,
} = useLogsGet(
  router.currentRoute.value.params.name as string,
  V1DownloadTargetKind.RestoreLog
);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
onBeforeMount(
  (): Promise<void> =>
    can(Action.Read, Resources.RESTORE.plural) ? getLogs() : void 0
);
</script>
