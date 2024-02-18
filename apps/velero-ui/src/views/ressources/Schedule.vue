<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <ScheduleActions :schedule="schedule"></ScheduleActions>
      <ScheduleStatus :schedule="schedule"></ScheduleStatus>
      <BackupDetails :spec="schedule?.spec.template"></BackupDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="schedule"></Describe>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScheduleActions from '@velero-ui-app/components/Schedule/ScheduleActions.vue';
import Describe from '@velero-ui-app/components/Describe.vue';
import ScheduleStatus from '@velero-ui-app/components/Schedule/ScheduleStatus.vue';
import BackupDetails from '@velero-ui-app/components/Backup/BackupDetails.vue';
import { onBeforeMount, toRef } from 'vue';
import { useScheduleStore } from '@velero-ui-app/stores/schedule.store';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useScheduleGet } from '@velero-ui-app/use/schedule/useScheduleGet';

const scheduleStore = useScheduleStore();
const { schedule } = storeToRefs(scheduleStore);

const router: Router = useRouter();

const { get } = useScheduleGet(toRef(router.currentRoute.value.params.name));

onBeforeMount(() => get());
</script>
