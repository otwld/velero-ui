<template>
  <div v-if="!error" class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <ScheduleActions :schedule="data"/>
        <ScheduleStatus :schedule="data"/>
        <BackupDetails :spec="data?.spec.template"/>
      </div>
      <div class="col-span-2">
        <Describe :data="data"/>
      </div>
    </div>
    <ScheduleBackupList />
  </div>
  <ResourceNotFound v-if="error" :page="Pages.SCHEDULES" />
</template>

<script lang="ts" setup>
import ScheduleActions from '@velero-ui-app/components/Schedule/ScheduleActions.vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import ScheduleStatus from '@velero-ui-app/components/Schedule/ScheduleStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { Resources, type V1Schedule } from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import ResourceNotFound from '@velero-ui-app/components/ResourceNotFound.vue';
import ScheduleBackupList from '@velero-ui-app/components/Schedule/ScheduleBackupList.vue';

const router: Router = useRouter();

const { on, off, data, error } = useKubernetesWatchObject<V1Schedule>(
  Resources.SCHEDULE,
  router.currentRoute.value.params.name as string,
);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
