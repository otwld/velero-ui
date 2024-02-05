<template>
  <List
    v-if="locations"
    :component="StorageLocationLine"
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
import { useStorageLocationStore } from '../stores/storage-location.store';
import StorageLocationLine from '../components/StorageLocation/StorageLocationLine.vue';

export default defineComponent({
  name: 'StorageLocationList',
  computed: {
    StorageLocationLine() {
      return StorageLocationLine;
    },
  },
  components: { List },
  setup() {
    const storageLocationStore = useStorageLocationStore();
    const { locations, total, offset, limit } =
      storeToRefs(storageLocationStore);
    return { storageLocationStore, locations, offset, limit, total };
  },
  data() {
    return {
      headers: [
        'Name',
        'Provider',
        'Last Sync',
        'Status',
        'Actions',
      ],
      searchInput: '',
    };
  },
  beforeMount() {
    this.storageLocationStore.fetch();
  },
  watch: {
    searchInput(value: string) {
      this.applyNameFilter(value);
    },
  },
  methods: {
    refresh() {
      this.storageLocationStore.fetch();
    },
    next() {
      this.storageLocationStore.next();
    },
    previous() {
      this.storageLocationStore.previous();
    },
    applyNameFilter(name: string) {
      this.storageLocationStore.applyNameFilter(name);
    },
  },
});
</script>
