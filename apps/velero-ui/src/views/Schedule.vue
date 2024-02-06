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
import ScheduleActions from '../components/Schedule/ScheduleActions.vue';
import Describe from '../components/Describe.vue';
import ScheduleStatus from '../components/Schedule/ScheduleStatus.vue';
import BackupDetails from '../components/Backup/BackupDetails.vue';
import { onBeforeMount } from 'vue';
import { useScheduleStore } from '../stores/schedule.store';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { storeToRefs } from 'pinia';

const scheduleStore = useScheduleStore();
const { schedule } = storeToRefs(scheduleStore);

const router: Router = useRouter();

onBeforeMount(() =>
  scheduleStore.get(
    router.currentRoute.value.params.name
  )
);
</script>
