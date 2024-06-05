<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          id="checkbox"
          v-model="checked"
          :value="data?.metadata?.name"
          aria-describedby="checkbox-1"
          type="checkbox"
          class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="checkbox" class="sr-only">checkbox</label>
      </div>
    </td>
    <router-link
      router-link
      :to="{
        name: Pages.BACKUP.name,
        params: {
          name: data?.metadata?.name,
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
      <router-link
        v-if="data?.metadata?.labels['velero.io/schedule-name']"
        :to="{
          name: Pages.SCHEDULE.name,
          params: {
            name: data?.metadata?.labels['velero.io/schedule-name'],
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faClockRotateLeft" class="w-3 h-3 mr-1.5" />
        {{ data?.metadata?.labels['velero.io/schedule-name'] }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base  text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{
        data.status?.startTimestamp
          ? convertTimestampToDate(data.status?.startTimestamp)
          : ''
      }}
    </td>
    <td
      class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ getRemainingTime(data.status.expiration) }}
    </td>
    <td class="p-4">
      <BackupStatusPhaseBadge
        :status="data.status.phase"
      ></BackupStatusPhaseBadge>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          title="Restore"
          :disabled="isDeleting"
          :class="{'cursor-not-allowed' : isDeleting}"
          @click="restore()"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-l-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
        >
          <FontAwesomeIcon :icon="faClockRotateLeft" class="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Download"
          :disabled="isDeleting || downloadLoading"
          :class="{'cursor-not-allowed' : isDeleting || downloadLoading,}"
          @click="download()"
          data-tooltip-target="tooltip-button-download"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FontAwesomeIcon
            v-if="!downloadLoading"
            :icon="faDownload"
            class="w-4 h-4"
          />
          <FontAwesomeIcon
            v-if="downloadLoading"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
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
          :class="{'cursor-not-allowed' : isDeleting}"
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
import {computed, onMounted, ref, toRef} from 'vue';
import type { V1Backup } from '@velero-ui/velero';
import {
  convertTimestampToDate,
  getRemainingTime,
} from '../../utils/date.utils';
import type { PropType } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import BackupStatusPhaseBadge from './BackupStatusPhaseBadge.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faClockRotateLeft,
  faTrashCan,
  faDownload,
  faArrowUpRightFromSquare,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { initModals, initTooltips } from 'flowbite';
import { V1BackupPhase } from '@velero-ui/velero';
import ModalDelete from '../Modals/ModalDelete.vue';
import { useBackupDownloadContent } from '@velero-ui-app/use/backup/useBackupDownloadContent';
import { useBackupDelete } from '@velero-ui-app/use/backup/useBackupDelete';

const props = defineProps({
  data: Object as PropType<V1Backup>,
});

onMounted(() => initTooltips());
onMounted(() => initModals());

const checked = ref(false)

const { download, downloadLoading } = useBackupDownloadContent(
  toRef(() => props.data?.metadata?.name)
);


const { remove, deleteLoading } = useBackupDelete(
  toRef(() => props.data?.metadata?.name)
);

const isDeleting = computed(() => {
  return (
    deleteLoading.value || props.data.status?.phase === V1BackupPhase.Deleting
  );
});

const restore = () => {};
</script>
