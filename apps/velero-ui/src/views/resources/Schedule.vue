<template>
  <Resource :error="!!error" :page="Pages.SCHEDULES">
    <template #left>
      <ScheduleActions :schedule="data" />
      <ScheduleStatus :schedule="data" />
      <BackupDetails :spec="data?.spec.template" />
    </template>
    <template #right>
      <ResourceManifest :data="data" />
    </template>
    <template #bottom>
      <ScheduleStats :name="router.currentRoute.value.params.name as string" />
      <ScheduleBackupList v-if="can(Action.Read, Resources.BACKUP.plural)" />
    </template>
  </Resource>
</template>

<script lang="ts" setup>
import ScheduleActions from '@velero-ui-app/components/Schedule/ScheduleActions.vue';
import ResourceManifest from '@velero-ui-app/components/Resource/ResourceManifest.vue';
import ScheduleStatus from '@velero-ui-app/components/Schedule/ScheduleStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { Resources, type V1Schedule } from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import ScheduleBackupList from '@velero-ui-app/components/Schedule/ScheduleBackupList.vue';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import ScheduleStats from '@velero-ui-app/components/Schedule/ScheduleStats.vue';
import Resource from '@velero-ui-app/components/Resource/Resource.vue';

const router: Router = useRouter();

const { on, off, data, error } = useKubernetesWatchObject<V1Schedule>(
  Resources.SCHEDULE,
  router.currentRoute.value.params.name as string
);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
