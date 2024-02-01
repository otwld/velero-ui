<template>
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          id="checkbox-"
          aria-describedby="checkbox-1"
          type="checkbox"
          class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="checkbox-" class="sr-only">checkbox</label>
      </div>
    </td>
    <router-link
      router-link
      :to="{
        name: Pages.BACKUP.name,
        params: {
          name: data.metadata.name,
          namespace: data.metadata.namespace,
        },
      }"
    >
      <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ data.metadata.name }}
          </div>
          <div class="text-xs font-normal text-gray-500 dark:text-gray-400">
            {{ data.metadata.uid }}
          </div>
        </div>
      </td>
    </router-link>
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      {{ data.metadata.namespace }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{
        data.status?.startTimestamp
          ? convertTimestampToDate(data.status?.startTimestamp)
          : ''
      }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ getRemainingTime(data.status.expiration) }}
    </td>
    <td class="p-4">
      <BackupStatusPhaseBadge
        :status="data.status.phase"
      ></BackupStatusPhaseBadge>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        type="button"
        @click="restore()"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
      >
        <FontAwesomeIcon :icon="faClockRotateLeft" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="download()"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-teal-800"
      >
        <FontAwesomeIcon :icon="faDownload" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="remove()"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4" />
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { V1Backup } from '@velero-ui/shared-types';
import {
  convertTimestampToDate,
  getRemainingTime,
} from '../../utils/date.utils';
import { useBackupStore } from '../../stores/backup.store';
import type { PropType } from 'vue';
import { Pages } from '../../utils/constants.utils';
import BackupStatusPhaseBadge from './BackupStatusPhaseBadge.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faClockRotateLeft,
  faTrashCan,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
  name: 'BackupLine',
  components: { BackupStatusPhaseBadge, FontAwesomeIcon },
  setup() {
    const backupStore = useBackupStore();
    return { backupStore };
  },
  data: () => ({
    Pages,
    faClockRotateLeft,
    faTrashCan,
    faDownload,
  }),
  props: {
    data: Object as PropType<V1Backup>,
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
