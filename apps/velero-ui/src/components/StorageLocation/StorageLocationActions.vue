<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon
        :icon="faServer"
        class="w-16 h-16 mr-2 dark:text-white"
      />

      <div>
        <h3
          v-if="location"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ location?.metadata?.name }}
        </h3>
        <div
          v-if="!location"
          class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div
          v-if="location"
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ location?.metadata?.uid }}
        </div>
        <div
          v-if="!location"
          class="h-1.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div v-if="location" class="flex items-center space-x-4">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          >
            <FontAwesomeIcon :icon="faPen" class="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
          >
            <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import {faPen, faServer, faTrashCan} from '@fortawesome/free-solid-svg-icons';

defineProps({
  location: Object as PropType<V1BackupStorageLocation>,
});
</script>
