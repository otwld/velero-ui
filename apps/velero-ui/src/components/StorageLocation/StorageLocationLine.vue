<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
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
        name: Pages.STORAGE_LOCATION.name,
        params: {
          name: data?.metadata?.name,
        },
      }"
    >
      <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ data?.metadata?.name }}
          </div>
          <div class="text-xs font-normal text-gray-500 dark:text-gray-400">
            {{ data?.metadata?.uid }}
          </div>
        </div>
      </td>
    </router-link>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data?.spec?.provider }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data?.status?.lastSyncedTime) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1BackupStorageLocationPhase.Available"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        ></div>
        <div
          v-if="data?.status?.phase !== V1BackupStorageLocationPhase.Available"
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        ></div>
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        ></div>
        {{ data?.status?.phase ? data.status.phase : 'Unknown' }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        type="button"
        title="Delete"
        @click="remove()"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4" />
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import type { PropType } from 'vue';
import { V1BackupStorageLocationPhase } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { Pages } from '../../utils/constants.utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

defineProps({
  data: Object as PropType<V1BackupStorageLocation>,
});

const remove = () => {};
</script>
