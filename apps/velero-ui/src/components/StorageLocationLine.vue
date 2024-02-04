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
    <router-link router-link :to="'/backups/' + data.metadata.uid">
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
      {{ data.spec.provider }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data.status.lastSyncedTime) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data.status.phase === V1BackupStorageLocationPhase.Available"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        ></div>
        <div
          v-if="data.status.phase !== V1BackupStorageLocationPhase.Available"
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        ></div>
        {{ data.status.phase }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        type="button"
        @click="remove()"
        data-modal-target="delete-user-modal"
        data-modal-toggle="delete-user-modal"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        <svg
          class="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import type { PropType } from 'vue';
import { useStorageLocationStore } from '../stores/storage-location.store';
import { V1BackupStorageLocationPhase } from '@velero-ui/velero';
import {convertTimestampToDate} from "../utils/date.utils";

export default defineComponent({
  name: 'StorageLocationLine',
  computed: {
    V1BackupStorageLocationPhase() {
      return V1BackupStorageLocationPhase;
    },
  },
  setup() {
    const storageLocationStore = useStorageLocationStore();
    return { storageLocationStore };
  },
  props: {
    data: Object as PropType<V1BackupStorageLocation>,
  },
  methods: {
    convertTimestampToDate,
    remove(): void {
      console.log('click delete');
    },
  },
});
</script>
