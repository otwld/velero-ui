<template>
  <div
    class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900"
  >
    <div class="col-span-full xl:col-auto">
      <BackupActions :backup="backup"></BackupActions>
      <div
        class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
      >
        <h3 class="mb-4 text-xl font-semibold dark:text-white">
          Language & Time
        </h3>
        <div class="mb-4">
          <label
            for="settings-language"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Select language</label
          >
          <select
            id="settings-language"
            name="countries"
            class="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>English (US)</option>
            <option>Italiano</option>
            <option>Français (France)</option>
            <option>正體字</option>
            <option>Español (España)</option>
            <option>Deutsch</option>
            <option>Português (Brasil)</option>
          </select>
        </div>
        <div class="mb-6">
          <label
            for="settings-timezone"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Time Zone</label
          >
          <select
            id="settings-timezone"
            name="countries"
            class="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>GMT+0 Greenwich Mean Time (GMT)</option>
            <option>GMT+1 Central European Time (CET)</option>
            <option>GMT+2 Eastern European Time (EET)</option>
            <option>GMT+3 Moscow Time (MSK)</option>
            <option>GMT+5 Pakistan Standard Time (PKT)</option>
            <option>GMT+8 China Standard Time (CST)</option>
            <option>GMT+10 Eastern Australia Standard Time (AEST)</option>
          </select>
        </div>
        <div>
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save all
          </button>
        </div>
      </div>
    </div>
    <div class="col-span-2">
      <Describe :data="backup"></Describe>
    </div>
  </div>
  <Logs :data="backupLogs" class="pb-6"></Logs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useBackupStore } from '../stores/backup.store';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { convertTimestampToDate, getRemainingTime } from '../utils/date.utils';
import BackupActions from '../components/Backup/BackupActions.vue';
import Logs from '../components/Logs.vue';
import Describe from "../components/Describe.vue";

export default defineComponent({
  name: 'Backup',
  components: {Describe, Logs, BackupActions },
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
    getRemainingTime,
    convertTimestampToDate,
    remove(): void {
      // this.backupStore.delete([this.data.metadata.name]);
      console.log('click delete');
    },
    restore(): void {
      console.log('click restore');
    },
    download(): void {
      console.log('click download');
    },
  },
});
</script>
