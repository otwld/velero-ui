<template>
  <ListHeader>
    <template #bulk-buttons>
      <button
        v-if="can(Action.Download, Resources.BACKUP.plural)"
        :class="{
          'cursor-not-allowed':
            childListRef?.getCheckedItems().length === 0 || downloadLoading,
        }"
        :disabled="
          childListRef?.getCheckedItems().length === 0 || downloadLoading
        "
        class="inline-flex justify-center p-1 text-gray-500 rounded hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
        @click="showModalBulkDownload = !showModalBulkDownload"
      >
        <FontAwesomeIcon
          v-if="!downloadLoading"
          :icon="faDownload"
          class="!w-5 !h-5"
        />
        <FontAwesomeIcon
          v-if="downloadLoading"
          :icon="faCircleNotch"
          class="!w-5 !h-5 animate-spin"
        />
      </button>
      <button
        v-if="can(Action.Delete, Resources.BACKUP.plural)"
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
          class="!w-5 !h-5"
        />
        <FontAwesomeIcon
          v-if="isLoadingDeleting"
          :icon="faCircleNotch"
          class="!w-5 !h-5 animate-spin"
        />
      </button>
    </template>
    <template #buttons>
      <button
        v-if="can(Action.Create, Resources.BACKUP.plural)"
        class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        @click="showModalAdd = !showModalAdd"
      >
        <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4 mr-2" />
        {{ t('global.button.new.title') }}
      </button>
    </template>
  </ListHeader>
  <ListContent ref="childListRef" :component="BackupLine" />
  <ListFooter />
  <VModal
    v-if="showModalAdd"
    id="modal-add"
    width="lg:w-6/12"
    @on-close="showModalAdd = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.createNewBackup') }}
      </h3>
    </template>
    <template #content>
      <BackupCreate @on-close="showModalAdd = false" />
    </template>
  </VModal>
  <ModalConfirmation
    v-if="showModalBulkRemove"
    :icon="faExclamationCircle"
    :text="
      t('modal.text.confirmation.deleteMany', {
        items: childListRef?.getCheckedItems().length,
      })
    "
    @on-close="showModalBulkRemove = false"
    @on-confirm="bulkRemove()"
  >
    <template #content>
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
  <ModalConfirmation
    v-if="showModalBulkDownload"
    :icon="faDownload"
    :text="
      t('modal.text.confirmation.downloadMany', {
        items: childListRef?.getCheckedItems().length,
      })
    "
    @on-close="showModalBulkDownload = false"
    @on-confirm="bulkDownload()"
  >
    <template #content>
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
import BackupLine from '@velero-ui-app/components/Backup/BackupLine.vue';
import {
  faCircleNotch,
  faDownload,
  faExclamationCircle,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import BackupCreate from '@velero-ui-app/components/Backup/forms/BackupFormCreate.vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import ListFooter from '@velero-ui-app/components/List/ListFooter.vue';
import ListContent from '@velero-ui-app/components/List/ListContent.vue';
import ListHeader from '@velero-ui-app/components/List/ListHeader.vue';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { Resources } from '@velero-ui/velero';
import { useDeleteManyKubernetesObjects } from '@velero-ui-app/composables/useDeleteManyKubernetesObjects';
import { useBackupManyDownloadContent } from '@velero-ui-app/composables/backup/useBackupManyDownloadContent';
import { Action } from '@velero-ui/shared-types';
import { can } from '@velero-ui-app/utils/policy.utils';

const { t } = useI18n();
const listStore = useListStore();

const { mutate: remove, isPending: isLoadingDeleting } =
  useDeleteManyKubernetesObjects(Resources.BACKUP);

const { download, downloadLoading } = useBackupManyDownloadContent();

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
      name: 'schedules.title',
      sort: {
        enabled: true,
        selected: false,
      },
    },
    {
      name: 'list.header.date',
      sort: {
        enabled: true,
        selected: false,
      },
    },
    {
      name: 'list.header.expireIn',
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
  ])
);

const showModalAdd = ref(false);
const showModalBulkRemove = ref(false);
const showModalBulkDownload = ref(false);

const bulkDownload = () => {
  download(childListRef?.value.getCheckedItems());
  childListRef?.value.resetCheckedItems();
};

const bulkRemove = () => {
  remove(childListRef?.value.getCheckedItems());
  childListRef?.value.resetCheckedItems();
};
</script>
