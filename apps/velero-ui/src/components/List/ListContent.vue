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
                  v-for="title in headers"
                  scope="col"
                  class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                >
                  {{ title }}
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
            >
              <component
                :is="component"
                v-for="item in data"
                class="hover:bg-gray-100 dark:hover:bg-gray-700"
                :data="item"
              >
              </component>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type {
  V1Backup,
  V1BackupStorageLocation,
  V1Restore,
  V1Schedule,
  V1VolumeSnapshotLocation,
} from '@velero-ui/velero';

export default defineComponent({
  name: 'ListContent',
  components: { FontAwesomeIcon },
  props: {
    headers: Array as PropType<string[]>,
    component: Object,
    data: Array as PropType<
      | V1Backup[]
      | V1Schedule[]
      | V1Restore
      | V1BackupStorageLocation[]
      | V1VolumeSnapshotLocation
    >,
  },
  data() {
    return {
      faChevronRight,
      faChevronLeft,
    };
  },
});
</script>
