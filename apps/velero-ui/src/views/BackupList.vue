<template>
  <List
    v-if="backups"
    :component="BackupLine"
    :data="backups"
    :headers="headers"
    :offset="offset"
    :limit="limit"
    :total="total"
  ></List>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import { storeToRefs } from 'pinia';
import List from '../components/List.vue';
import BackupLine from '../components/Backup/BackupLine.vue';

export default defineComponent({
  name: 'BackupList',
  computed: {
    BackupLine() {
      return BackupLine;
    },
  },
  components: { List },
  setup() {
    const backupStore = useBackupStore();
    const { backups, total, offset, limit } = storeToRefs(backupStore);
    return { backupStore, backups, offset, limit, total };
  },
  data() {
    return {
      headers: ['Name', 'Schedule', 'Date', 'Expire in', 'Status', 'Actions'],
      searchInput: '',
    };
  },
  beforeMount() {
    this.backupStore.fetch();
  },
  watch: {
    searchInput(value: string) {
      this.applyNameFilter(value);
    },
  },
  methods: {
    refresh() {
      this.backupStore.fetch();
    },
    next() {
      this.backupStore.next();
    },
    previous() {
      this.backupStore.previous();
    },
    applyNameFilter(name: string) {
      this.backupStore.applyNameFilter(name);
    },
  },
});
</script>
