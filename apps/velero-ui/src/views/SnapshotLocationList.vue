<template>
  <List
    v-if="locations"
    :component="SnapshotLocationLine"
    :data="locations"
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
import { useSnapshotLocationStore } from '../stores/snapshot-location';
import SnapshotLocationLine from '../components/SnapshotLocation/SnapshotLocationLine.vue';

export default defineComponent({
  name: 'SnapshotLocationList',
  computed: {
    SnapshotLocationLine() {
      return SnapshotLocationLine;
    },
  },
  components: { List },
  setup() {
    const snapshotLocationStore = useSnapshotLocationStore();
    const { locations, total, offset, limit } = storeToRefs(
      snapshotLocationStore
    );
    return { snapshotLocationStore, locations, offset, limit, total };
  },
  data() {
    return {
      headers: [
        'Name',
        'Provider',
        'Status',
        'Actions',
      ],
      searchInput: '',
    };
  },
  beforeMount() {
    this.snapshotLocationStore.fetch();
  },
  watch: {
    searchInput(value: string) {
      this.applyNameFilter(value);
    },
  },
  methods: {
    refresh() {
      this.snapshotLocationStore.fetch();
    },
    next() {
      this.snapshotLocationStore.next();
    },
    previous() {
      this.snapshotLocationStore.previous();
    },
    applyNameFilter(name: string) {
      this.snapshotLocationStore.applyNameFilter(name);
    },
  },
});
</script>
