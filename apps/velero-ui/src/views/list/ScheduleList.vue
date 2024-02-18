<template>
  <List
    v-if="schedules"
    :component="ScheduleLine"
    :data="schedules"
    :loading="isGettingMany"
    :headers="headers"
    @onRefresh="getMany"
  ></List>
</template>
<script setup lang="ts">
import List from '@velero-ui-app/components/List/List.vue';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '@velero-ui-app/stores/schedule.store';
import ScheduleLine from '@velero-ui-app/components/Schedule/ScheduleLine.vue';
import { onBeforeMount } from 'vue';
import { useScheduleGetMany } from '@velero-ui-app/use/schedule/useScheduleGetMany';

const scheduleStore = useScheduleStore();
const { schedules } = storeToRefs(scheduleStore);

const { getMany, isGettingMany } = useScheduleGetMany();

onBeforeMount(() => getMany());

const headers = [
  'Name',
  'Storage Location',
  'Cron',
  'Last Backup',
  'Status',
  'Actions',
];
</script>
