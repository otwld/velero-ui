<template>
  <List
    v-if="schedules"
    :component="ScheduleLine"
    :data="schedules"
    :headers="headers"
    :offset="offset"
    :limit="limit"
    :total="total"
  ></List>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import List from '../components/List.vue';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '../stores/schedule.store';
import ScheduleLine from "../components/Schedule/ScheduleLine.vue";

export default defineComponent({
  name: 'ScheduleList',
  computed: {
    ScheduleLine() {
      return ScheduleLine
    }
  },
  components: { List },
  setup() {
    const scheduleStore = useScheduleStore();
    const { schedules, total, offset, limit } = storeToRefs(scheduleStore);
    return { scheduleStore, schedules, offset, limit, total };
  },
  data() {
    return {
      headers: ['Name', 'Storage Location', 'Cron', 'Last Backup', 'Status', 'Actions'],
      searchInput: '',
    };
  },
  beforeMount() {
    this.scheduleStore.fetch();
  },
  watch: {
    searchInput(value: string) {
      this.applyNameFilter(value);
    },
  },
  methods: {
    refresh() {
      this.scheduleStore.fetch();
    },
    next() {
      this.scheduleStore.next();
    },
    previous() {
      this.scheduleStore.previous();
    },
    applyNameFilter(name: string) {
      this.scheduleStore.applyNameFilter(name);
    },
  },
});
</script>
