<template>
  <ListHeader>
    <template v-slot:bulk-buttons>
      <button
        class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
      >
        <FontAwesomeIcon :icon="faClockRotateLeft" class="w-5 h-5" />
      </button>
      <button
        class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
      >
        <FontAwesomeIcon :icon="faDownload" class="w-5 h-5" />
      </button>
      <button
        class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
      >
        <FontAwesomeIcon :icon="faTrashCan" class="w-5 h-5" />
      </button>
    </template>
    <template v-slot:buttons>
      <button
        class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        @click="showModalAdd = !showModalAdd"
      >
        <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 mr-2" />
        New
      </button>
    </template>
  </ListHeader>
  <ListContent :component="BackupLine"></ListContent>
  <ListFooter></ListFooter>
  <VModal v-if="showModalAdd" id="modal-add" @onClose="showModalAdd = false">
    <template v-slot:header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        Create a new Backup
      </h3>
    </template>
    <template v-slot:content>
      <BackupCreate @onClose="showModalAdd = false"></BackupCreate>
    </template>
  </VModal>
</template>
<script lang="ts" setup>
import BackupLine from '@velero-ui-app/components/Backup/BackupLine.vue';
import {
  faClockRotateLeft,
  faDownload,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import BackupCreate from '@velero-ui-app/components/Backup/BackupCreate.vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import ListFooter from '@velero-ui-app/components/List/ListFooter.vue';
import ListContent from '@velero-ui-app/components/List/ListContent.vue';
import ListHeader from '@velero-ui-app/components/List/ListHeader.vue';
import { onBeforeMount, ref } from 'vue';

const listStore = useListStore();

onBeforeMount(() =>
  listStore.setHeaders([
    {
      name: 'Name',
      sort: {
        enabled: true,
        selected: true,
        ascending: true,
      },
    },
    {
      name: 'Schedule',
      sort: {
        enabled: true,
        selected: false,
      },
    },
    {
      name: 'Date',
      sort: {
        enabled: true,
        selected: false,
      },
    },
    {
      name: 'Expire in',
      sort: {
        enabled: true,
        selected: false,
      },
    },
    {
      name: 'Status',
      sort: {
        enabled: false,
      },
    },
    {
      name: 'Actions',
      sort: {
        enabled: false,
      },
    },
  ]),
);

const showModalAdd = ref(false);
</script>
