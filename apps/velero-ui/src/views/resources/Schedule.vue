<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <ScheduleActions :schedule="data"></ScheduleActions>
      <ScheduleStatus :schedule="data"></ScheduleStatus>
      <BackupDetails :spec="data?.spec.template"></BackupDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="data"></Describe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ScheduleActions from '@velero-ui-app/components/Schedule/ScheduleActions.vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import ScheduleStatus from '@velero-ui-app/components/Schedule/ScheduleStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { useKubernetesObject } from '@velero-ui-app/composables/useKubernetesObject';
import { Resources, type V1Schedule } from '@velero-ui/velero';

const router: Router = useRouter();

const { data } = useKubernetesObject<V1Schedule>(
  Resources.SCHEDULE,
  router.currentRoute.value.params.name,
);
</script>
