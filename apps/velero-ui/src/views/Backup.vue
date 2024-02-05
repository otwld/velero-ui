<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <BackupActions :backup="backup"></BackupActions>
      <BackupStatus :backup="backup"></BackupStatus>
      <BackupDetails :spec="backup?.spec"></BackupDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="backup"></Describe>
    </div>
  </div>
  <Logs :data="backupLogs" :downloadable="true" class="pb-6"></Logs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import BackupActions from '../components/Backup/BackupActions.vue';
import Logs from '../components/Logs.vue';
import Describe from '../components/Describe.vue';
import BackupDetails from '../components/Backup/BackupDetails.vue';
import BackupStatus from '../components/Backup/BackupStatus.vue';

export default defineComponent({
  name: 'Backup',
  components: { BackupStatus, BackupDetails, Describe, Logs, BackupActions },
  setup() {
    const backupStore = useBackupStore();
    const { backup, backupLogs } = storeToRefs(backupStore);

    const router: Router = useRouter();
    return { backupStore, router, backup, backupLogs };
  },
  beforeMount() {
    this.backupStore.get(
      this.router.currentRoute.value.params.name,
      this.router.currentRoute.value.params.namespace
    );
    this.backupLogs = undefined;
    this.backupStore.logs(
      this.router.currentRoute.value.params.name,
      this.router.currentRoute.value.params.namespace
    );
  },
  methods: {
    remove(): void {
      // this.backupStore.delete([this.data.metadata.name]);
      console.log('click delete');
    },
    restore(): void {
      console.log('click restore');
    },
    download(): void {
      this.backupStore.download(this.backup.metadata.name)
    },
    downloadLogs(): void {
      this.backupStore.downloadLogs(this.backup.metadata.name)
    },
  },
});
</script>
