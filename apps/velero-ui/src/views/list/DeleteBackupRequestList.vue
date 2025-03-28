<template>
  <ListHeader>
    <template v-slot:bulk-buttons>
      <button
        :class="{
          'cursor-not-allowed':
            childListRef?.getCheckedItems().length === 0 || isLoadingDeleting,
        }"
        :disabled="
          childListRef?.getCheckedItems().length === 0 || isLoadingDeleting
        "
        class="inline-flex justify-center p-1 text-gray-500 rounded hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
        @click="showModalBulkRemove = !showModalBulkRemove"
      >
        <FontAwesomeIcon
          v-if="!isLoadingDeleting"
          :icon="faTrashCan"
          class="w-5 h-5"
        />
        <FontAwesomeIcon
          v-if="isLoadingDeleting"
          :icon="faCircleNotch"
          class="w-5 h-5 animate-spin"
        />
      </button>
    </template>
  </ListHeader>
  <ListContent ref="childListRef" :component="DeleteBackupRequestLine" />
  <ListFooter />
  <ModalConfirmation
    v-if="showModalBulkRemove"
    :icon="faExclamationCircle"
    :text="
      t('modal.text.confirmation.deleteMany', {
        items: childListRef?.getCheckedItems().length,
      })
    "
    @onClose="showModalBulkRemove = false"
    @onConfirm="bulkRemove()"
  >
    <template v-slot:content>
      <div class="flex flex-col justify-center mb-6">
        <span
          v-for="(item, index) in childListRef?.getCheckedItems()"
          :key="index"
          class="mt-2 px-1 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
          >{{ item }}</span
        >
      </div>
    </template>
  </ModalConfirmation>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import DeleteBackupRequestLine from '@velero-ui-app/components/Request/DeleteBackupRequestLine.vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import {
  faCircleNotch,
  faExclamationCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ListHeader from '@velero-ui-app/components/List/ListHeader.vue';
import ListFooter from '@velero-ui-app/components/List/ListFooter.vue';
import ListContent from '@velero-ui-app/components/List/ListContent.vue';
import { useDeleteManyKubernetesObjects } from '@velero-ui-app/composables/useDeleteManyKubernetesObjects';
import { Resources } from '@velero-ui/velero';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const listStore = useListStore();

const { mutate: remove, isPending: isLoadingDeleting } =
  useDeleteManyKubernetesObjects(Resources.DELETE_BACKUP_REQUEST);

const childListRef = ref(null);

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
      name: 'list.header.target',
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

const showModalBulkRemove = ref(false);

const bulkRemove = () => {
  remove(childListRef?.value.getCheckedItems());
  childListRef?.value.resetCheckedItems();
};
</script>
