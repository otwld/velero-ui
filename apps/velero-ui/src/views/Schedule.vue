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
<script lang="ts">
import { defineComponent } from 'vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '../stores/schedule.store';
import ScheduleActions from '../components/Schedule/ScheduleActions.vue';
import Describe from '../components/Describe.vue';
import ScheduleStatus from '../components/Schedule/ScheduleStatus.vue';
import BackupDetails from "../components/Backup/BackupDetails.vue";

export default defineComponent({
  name: 'Schedule',
  components: {BackupDetails, ScheduleStatus, Describe, ScheduleActions },
  setup() {
    const scheduleStore = useScheduleStore();
    const { schedule } = storeToRefs(scheduleStore);

    const router: Router = useRouter();
    return { scheduleStore, router, schedule };
  },
  beforeMount() {
    this.scheduleStore.get(
      this.router.currentRoute.value.params.name,
      this.router.currentRoute.value.params.namespace
    );
  },
  methods: {
    remove(): void {
      console.log('click delete');
    },
    switchStatus(): void {
      console.log('click switchStatus');
    },
  },
});
</script>
