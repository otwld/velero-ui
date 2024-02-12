<template>
  <div class="grid px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flow-root">
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
          <div v-if="data">
            <p v-for="line of data" class="flex-row">
              {{ line }}
            </p>
          </div>
          <div v-if="data?.length === 0" class="inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clip-rule="evenodd"
              />
            </svg>

            <p class="ml-2">No logs to show!</p>
          </div>
          <div v-if="!data" class="inline-flex items-center">
            <svg
              aria-hidden="true"
              role="status"
              class="w-4 h-4 animate-spin"
              viewBox="0 0 100 101"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            <i class="ml-2">Retrieving logs...</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import {
  faCircleNotch,
  faFileArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { V1DownloadTargetKind } from '@velero-ui/velero';
import { toRef } from 'vue';
import { useDownloadLogs } from '@velero-ui-app/use/useDownloadLogs';

const props = defineProps({
  data: Array as PropType<string[]>,
  name: String,
  type: String as PropType<V1DownloadTargetKind>,
});

const { download, downloadLoading } = useDownloadLogs(
  toRef(() => props.name),
  toRef(() => props.type)
);
</script>
