<template>
  <Resource :error="!!error" :page="Pages.RESTORES">
    <template #left>
      <RestoreActions :restore="data" />
      <RestoreStatus :restore="data" />
      <RestoreDetails :spec="data?.spec" />
    </template>
    <template #right>
      <ResourceManifest :data="data" />
    </template>
    <template #bottom>
      <PodVolumes v-if="can(Action.Read, Resources.RESTORE.plural)" />
      <Logs
        v-if="can(Action.Logs, Resources.RESTORE.plural)"
        :data="logs"
        :loading="isLoading"
        :name="data?.metadata?.name"
        :type="V1DownloadTargetKind.RestoreLog"
        class="pb-6"
      />
    </template>
  </Resource>
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
import ResourceManifest from '@velero-ui-app/components/Resource/ResourceManifest.vue';
import Logs from '@velero-ui-app/components/Logs.vue';
import { useLogsGet } from '@velero-ui-app/composables/useLogsGet';
import RestoreActions from '@velero-ui-app/components/Restore/RestoreActions.vue';
import RestoreStatus from '@velero-ui-app/components/Restore/RestoreStatus.vue';
import RestoreDetails from '@velero-ui-app/components/Restore/RestoreDetails.vue';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import ResourceNotFound from '@velero-ui-app/components/Resource/ResourceNotFound.vue';
import PodVolumes from '@velero-ui-app/components/PodVolume/PodVolumes.vue';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import Resource from '@velero-ui-app/components/Resource/Resource.vue';

const router: Router = useRouter();

const { on, off, data, error } = useKubernetesWatchObject<V1Restore>(
  Resources.RESTORE,
  router.currentRoute.value.params.name as string
);

const {
  data: logs,
  isLoading,
  refetch,
} = useLogsGet(
  router.currentRoute.value.params.name as string,
  V1DownloadTargetKind.RestoreLog
);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
onBeforeMount(() =>
  can(Action.Read, Resources.RESTORE.plural) ? refetch() : void 0
);
</script>
