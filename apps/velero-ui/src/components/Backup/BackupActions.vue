<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon
        :icon="faFloppyDisk"
        class="w-16 h-16 mr-2 dark:text-white"
      />

      <div>
        <h3
          v-if="backup"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ backup?.metadata?.name }}
        </h3>
        <div
          v-if="!backup"
          class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div
          v-if="backup"
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ backup?.metadata?.uid }}
        </div>
        <div
          v-if="!backup"
          class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div class="flex items-center space-x-4">
          <button
            type="button"
            :class="{'cursor-not-allowed' : isDeleting}"
            data-modal-target="modal-restore"
            data-modal-toggle="modal-restore"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          >
            <FontAwesomeIcon :icon="faClockRotateLeft" class="w-4 h-4 mr-2" />
            Restore
          </button>
          <button
            type="button"
            :disabled="downloadLoading || isDeleting"
            :class="{'cursor-not-allowed' : downloadLoading || isDeleting}"
            @click="download()"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FontAwesomeIcon
              v-if="!downloadLoading"
              :icon="faDownload"
              class="w-4 h-4 mr-2"
            />
            <FontAwesomeIcon
              v-if="downloadLoading"
              :icon="faCircleNotch"
              class="w-4 h-4 animate-spin mr-2"
            />
            Download
          </button>
          <button
            type="button"
            :disabled="isDeleting"
            :data-modal-target="`modal-delete-${backup?.metadata?.name}`"
            :data-modal-toggle="`modal-delete-${backup?.metadata?.name}`"
            :class="{'cursor-not-allowed' : isDeleting}"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
          >
            <FontAwesomeIcon
              v-if="isDeleting"
              :icon="faCircleNotch"
              class="w-4 h-4 animate-spin mr-2"
            />
            <FontAwesomeIcon
              v-if="!isDeleting"
              :icon="faTrashCan"
              class="w-4 h-4 mr-2"
            />
            {{ isDeleting ? 'Deleting' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <ModalDelete
    :id="`modal-delete-${backup?.metadata?.name}`"
    @onConfirm="remove"
    :name="backup?.metadata?.name"
  ></ModalDelete>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, onMounted, toRef } from 'vue';
import type { V1Backup } from '@velero-ui/velero';
import { V1BackupPhase } from '@velero-ui/velero';
import {
  faCircleNotch,
  faClockRotateLeft,
  faDownload,
  faFloppyDisk,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { initModals } from 'flowbite';
import ModalDelete from '../Modals/ModalDelete.vue';
import { useBackupDownloadContent } from '@velero-ui-app/use/backup/useBackupDownloadContent';
import { useBackupDelete } from '@velero-ui-app/use/backup/useBackupDelete';

const props = defineProps({
  backup: Object as PropType<V1Backup>,
});

onMounted(() => initModals());

const { download, downloadLoading } = useBackupDownloadContent(
  toRef(() => props.backup?.metadata?.name)
);

const { remove, deleteLoading } = useBackupDelete(
  toRef(() => props.backup?.metadata?.name)
);

const isDeleting = computed(() => {
  return (
    deleteLoading.value ||
    props.backup?.status?.phase === V1BackupPhase.Deleting
  );
});
</script>
