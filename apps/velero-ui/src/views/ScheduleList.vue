<template>
  <List
    v-if="schedules"
    :component="ScheduleLine"
    :data="schedules"
    :headers="headers"
    :offset="offset"
    :limit="limit"
    :total="total"
    @onSearchInput="onSearchInput"
    @onNext="onNext"
    @onPrevious="onPrevious"
    @onRefresh="onRefresh"
  ></List>
</template>
<script setup lang="ts">
import List from '../components/List/List.vue';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '../stores/schedule.store';
import ScheduleLine from '../components/Schedule/ScheduleLine.vue';
import { onBeforeMount } from 'vue';

const scheduleStore = useScheduleStore();
const { schedules, total, offset, limit } = storeToRefs(scheduleStore);

const headers = [
  'Name',
  'Storage Location',
  'Cron',
  'Last Backup',
  'Status',
  'Actions',
];

onBeforeMount(() => scheduleStore.fetch());

const onSearchInput = (value) => scheduleStore.applyNameFilter(value);
const onNext = () => scheduleStore.next();
const onPrevious = () => scheduleStore.previous();
const onRefresh = () => scheduleStore.fetch();
</script>
