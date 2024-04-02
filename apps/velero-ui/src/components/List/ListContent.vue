<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden shadow">
          <table
            class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600"
          >
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th scope="col" class="p-4">
                  <div class="flex items-center">
                    <input
                      id="checkbox-all"
                      aria-describedby="checkbox-1"
                      type="checkbox"
                      class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-all" class="sr-only">checkbox</label>
                  </div>
                </th>
                <th
                  v-for="(title, index) in headers" :key="`th-${index}`"
                  scope="col"
                  class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                >
                  {{ title }}
                </th>
              </tr>
            </thead>
            <tbody
              :class="{
                'animate-pulse-loading': loading && data.length > 0,
              }"
              class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
            >
              <component :is="component" v-for="(item, index) in data" :data="item" :key="`list-item-${index}`" />
            </tbody>
          </table>
          <div
            v-if="data.length === 0 && !loading"
            class="w-full flex flex-col items-center py-10 text-gray-400 dark:text-gray-300 dark:bg-gray-800"
          >
            <FontAwesomeIcon :icon="faInfoCircle" class="w-16 h-16 mb-5" />
            There are no entries.
          </div>
          <div
            v-if="loading && data.length === 0"
            class="w-full flex flex-col items-center py-10 text-gray-600 dark:text-gray-300 dark:bg-gray-800"
          >
            <FontAwesomeIcon
              :icon="faCircleNotch"
              class="w-16 h-16 mb-5 animate-spin"
            />
            Fetching entries
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type {
  V1Backup,
  V1BackupRepository,
  V1BackupStorageLocation,
  V1DeleteBackupRequest,
  V1DownloadRequest,
  V1Restore,
  V1Schedule,
  V1ServerStatusRequest,
  V1VolumeSnapshotLocation,
} from '@velero-ui/velero';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleNotch, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

defineProps({
  headers: Array as PropType<string[]>,
  component: Object,
  loading: Boolean,
  data: Array as PropType<
    | V1Backup[]
    | V1Schedule[]
    | V1Restore[]
    | V1BackupStorageLocation[]
    | V1VolumeSnapshotLocation[]
    | V1BackupRepository[]
    | V1DeleteBackupRequest[]
    | V1ServerStatusRequest[]
    | V1DownloadRequest[]
  >,
});

// const checkBoxes = ref([]);

// const checked = computed((checked) => checkBoxes.value.find((e) => e === checked));
</script>
