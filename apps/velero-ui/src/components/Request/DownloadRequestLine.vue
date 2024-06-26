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
    <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
        <div class="text-base font-semibold text-gray-900 dark:text-white">
          {{
            data?.metadata?.name.length > 42
              ? data?.metadata?.name.slice(0, 42) + '...'
              : data?.metadata?.name
          }}
        </div>
        <div class="text-xs font-normal text-gray-500 dark:text-gray-400">
          {{ data?.metadata?.uid }}
        </div>
      </div>
    </td>
    <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
      {{ data?.spec?.target?.name }}
    </td>
    <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
      {{ data?.spec?.target?.kind }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.status?.expiration ? remainingTime : '' }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1DownloadRequestPhase.Processed"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        ></div>
        <div
          v-if="data?.status?.phase === V1DownloadRequestPhase.New"
          class="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"
        ></div>
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        ></div>
        {{ data?.status?.phase ? data.status.phase : 'Unknown' }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          title="Describe"
          :disabled="isDeleting"
          :data-modal-target="`modal-describe-${data?.metadata?.name}`"
          :data-modal-toggle="`modal-describe-${data?.metadata?.name}`"
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-lg text-center text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <FontAwesomeIcon :icon="faFileCode" class="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Download"
          @click="download()"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FontAwesomeIcon :icon="faDownload" class="w-4 h-4" />
          <div
            id="tooltip-button-download"
            role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Download
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </button>
        <button
          type="button"
          title="Delete"
          :disabled="isDeleting"
          :data-modal-target="`modal-delete-${data?.metadata?.name}`"
          :data-modal-toggle="`modal-delete-${data?.metadata?.name}`"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-r-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
        >
          <FontAwesomeIcon
            v-if="isDeleting"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
          <FontAwesomeIcon
            v-if="!isDeleting"
            :icon="faTrashCan"
            class="w-4 h-4"
          />
        </button>
      </div>
    </td>
  </tr>
  <ModalDelete
    :id="`modal-delete-${data?.metadata?.name}`"
    @onConfirm="remove"
    :name="data?.metadata?.name"
  ></ModalDelete>
  <ModalDescribe
    :id="`modal-describe-${data?.metadata?.name}`"
    :name="data?.metadata?.name"
    :data="data"
  ></ModalDescribe>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { V1DownloadRequest } from '@velero-ui/velero';
import { getRemainingTime } from '../../utils/date.utils';
import type { PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTrashCan,
  faDownload,
  faCircleNotch, faFileCode,
} from '@fortawesome/free-solid-svg-icons';
import { initModals, initTooltips } from 'flowbite';
import ModalDelete from '../Modals/ModalDelete.vue';
import { V1DownloadRequestPhase } from '@velero-ui/velero';
import ModalDescribe from "@velero-ui-app/components/Modals/ModalDescribe.vue";

const props = defineProps({
  data: Object as PropType<V1DownloadRequest>,
});

const remainingTime = ref(0);

onMounted(() => initTooltips());
onMounted(() => initModals());

const interval = setInterval(
  () => (remainingTime.value = getRemainingTime(props.data.status.expiration))
);

onUnmounted(() => clearInterval(interval));

const isDeleting = false;

const remove = () => {};
const download = () => window.open(props.data.status.downloadURL);
</script>
