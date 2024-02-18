<template>
  <div class="grid grid-cols-1 px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold dark:text-white">Logs</h3>
        <button
          v-if="data?.length > 0"
          @click="download()"
          :disabled="downloadLoading"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FontAwesomeIcon
            v-if="!downloadLoading"
            :icon="faFileArrowDown"
            class="w-4 h-4 mr-2"
          />
          <FontAwesomeIcon
            v-if="downloadLoading"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin mr-2"
          />
          Download
        </button>
      </div>
      <div
        class="p-4 text-sm text-white bg-gray-900 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-white max-h-[500px] overflow-auto"
      >
        <div v-if="data" class="flex-col">
          <p v-for="line of data">
            {{ line }}
          </p>
        </div>
        <div v-if="data?.length === 0 && !loading" class="inline-flex items-center">
          <FontAwesomeIcon
            :icon="faInfoCircle"
            class="w-4 h-4"
          />
          <p class="ml-2">No logs to show!</p>
        </div>
        <div v-if="loading" class="inline-flex items-center">
          <FontAwesomeIcon
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
          <i class="ml-2">Retrieving logs...</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import {
  faCircleNotch,
  faFileArrowDown, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { V1DownloadTargetKind } from '@velero-ui/velero';
import { toRef } from 'vue';
import { useLogsDownload } from '@velero-ui-app/use/useLogsDownload';

const props = defineProps({
  data: Array as PropType<string[]>,
  name: String,
  loading: Boolean,
  type: String as PropType<V1DownloadTargetKind>,
});

const { download, downloadLoading } = useLogsDownload(
  toRef(() => props.name),
  toRef(() => props.type)
);
</script>
