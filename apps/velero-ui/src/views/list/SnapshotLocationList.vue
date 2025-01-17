<template>
  <ListHeader>
    <template v-slot:bulk-buttons>
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
        {{ t('global.button.new.title') }}
      </button>
    </template>
  </ListHeader>
  <ListContent :component="SnapshotLocationLine" />
  <ListFooter />

  <VModal
    v-if="showModalAdd"
    id="modal-add"
    width="sm:lg:w-6/12"
    @onClose="showModalAdd = false"
  >
    <template v-slot:header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.createNewVolumeSnapshotLocation') }}
      </h3>
    </template>
    <template v-slot:content>
      <SnapshotLocationFormCreate @onClose="showModalAdd = false" />
    </template>
  </VModal>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ListHeader from '@velero-ui-app/components/List/ListHeader.vue';
import ListFooter from '@velero-ui-app/components/List/ListFooter.vue';
import ListContent from '@velero-ui-app/components/List/ListContent.vue';
import SnapshotLocationLine from '@velero-ui-app/components/SnapshotLocation/SnapshotLocationLine.vue';
import { useI18n } from 'vue-i18n';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import SnapshotLocationFormCreate from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormCreate.vue';

const { t } = useI18n();
const listStore = useListStore();

onBeforeMount(() =>
  listStore.setHeaders([
    {
      name: 'list.header.name',
      sort: {
        enabled: true,
        selected: true,
        ascending: true,
      },
    },
    {
      name: 'list.header.provider',
      sort: {
        enabled: true,
        selected: false,
      },
    },
    {
      name: 'list.header.status',
      sort: {
        enabled: false,
      },
    },
    {
      name: 'list.header.actions',
      sort: {
        enabled: false,
      },
    },
  ]),
);

const showModalAdd = ref(false);
</script>
