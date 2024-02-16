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
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      <router-link
        v-if="data?.spec?.backupName"
        :to="{
          name: Pages.BACKUP.name,
          params: {
            name: data?.spec?.backupName,
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faFloppyDisk" class="w-3 h-3 mr-1.5" />
        {{ data?.spec?.backupName }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1DeleteBackupRequestPhase.Processed && data?.status?.errors.length === 0"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        ></div>
        <div
          v-if="data?.status?.phase === V1DeleteBackupRequestPhase.Processed && data?.status?.errors.length > 0"
          class="h-2.5 w-2.5 rounded-full bg-orange-400 mr-2"
        ></div>
        <div
          v-if="data?.status?.phase === V1DeleteBackupRequestPhase.New"
          class="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"
        ></div>
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        ></div>
        {{ data?.status?.phase ? data.status.phase : 'Unknown' }}
        {{ data?.status?.errors.length ? 'with errors' : '' }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          @click="download()"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-l-lg text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { V1DeleteBackupRequest } from '@velero-ui/velero';
import type { PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTrashCan,
  faDownload,
  faCircleNotch,
  faFloppyDisk,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { initModals, initTooltips } from 'flowbite';
import ModalDelete from '../Modals/ModalDelete.vue';
import { V1DeleteBackupRequestPhase } from '@velero-ui/velero';
import { Pages } from '@velero-ui-app/utils/constants.utils';

const props = defineProps({
  data: Object as PropType<V1DeleteBackupRequest>,
});

onMounted(() => initTooltips());
onMounted(() => initModals());

const isDeleting = false;

const remove = () => {};
const download = () => window.open(props.data.status.downloadURL);
</script>
