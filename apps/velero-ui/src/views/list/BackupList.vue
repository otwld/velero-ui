<template>
  <ListHeader>
    <template #bulk-buttons>
      <BulkButton
        v-if="can(Action.Download, Resources.BACKUP.plural)"
        :icon="faDownload"
        :loading="downloadLoading"
        @click="showModalBulkDownload = !showModalBulkDownload"
      />
      <BulkButton
        v-if="can(Action.Delete, Resources.BACKUP.plural)"
        :icon="faTrashCan"
        :loading="isLoadingDeleting"
        @click="showModalBulkRemove = !showModalBulkRemove"
      />
    </template>
    <template #filters>
      <SearchFilter :type="Filter.Schedule" />
      <SearchFilter :type="Filter.Status" />
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
  <ListContent :component="BackupLine" />
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
        items: checkedItems.size,
      })
    "
    @on-close="showModalBulkRemove = false"
    @on-confirm="
      remove({
        names: [...checkedItems],
        forced: forceDeleteContext.value,
      })
    "
  >
    <template #content>
      <div class="flex flex-col justify-center mb-6">
        <span
          v-for="(item, index) in checkedItems.keys()"
          :key="index"
          class="mt-2 px-1 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
          >{{ item }}</span
        >
      </div>
      <FormKit
        id="force-delete"
        :name="t('form.field.forceDelete')"
        outer-class="mb-2"
        type="checkbox"
        wrapper-class="flex items-center justify-center"
      >
        <template #label>
          <label
            class="flex ml-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t('form.field.forceDelete') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-force-delete"
            />
          </label>
        </template>
      </FormKit>
    </template>
  </ModalConfirmation>
  <ModalConfirmation
    v-if="showModalBulkDownload"
    :icon="faDownload"
    :text="
      t('modal.text.confirmation.downloadMany', {
        items: checkedItems.size,
      })
    "
    @on-close="showModalBulkDownload = false"
    @on-confirm="download([...checkedItems])"
  >
    <template #content>
      <div class="flex flex-col justify-center mb-6">
        <span
          v-for="(item, index) in checkedItems.keys()"
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
  faDownload,
  faExclamationCircle,
  faPlus,
  faQuestionCircle,
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
import { Action, Filter, SortBy, SortDirection } from '@velero-ui/shared-types';
import { can } from '@velero-ui-app/utils/policy.utils';
import { useFormKitContextById } from '@formkit/vue';
import SearchFilter from '@velero-ui-app/components/Search/SearchFilter.vue';
import { storeToRefs } from 'pinia';
import BulkButton from '@velero-ui-app/components/BulkButton.vue';

const { t } = useI18n();
const listStore = useListStore();
const { checkedItems } = storeToRefs(listStore);

const { mutate: remove, isPending: isLoadingDeleting } =
  useDeleteManyKubernetesObjects(Resources.BACKUP);

const { mutate: download, isPending: downloadLoading } =
  useBackupManyDownloadContent();

onBeforeMount(() =>
  listStore.setHeaders([
    {
      name: 'list.header.name',
      sort: {
        type: SortBy.Name,
        selected: true,
        direction: SortDirection.Ascending,
      },
    },
    {
      name: 'schedules.title',
      sort: {
        type: SortBy.Schedule,
        selected: false,
      },
    },
    {
      name: 'list.header.date',
      sort: {
        type: SortBy.StartTimestamp,
        selected: false,
      },
    },
    {
      name: 'list.header.expireIn',
      sort: {
        type: SortBy.Expiration,
        selected: false,
      },
    },
    {
      name: 'list.header.status',
    },
    {
      name: 'list.header.actions',
    },
  ])
);

const showModalAdd = ref(false);
const showModalBulkRemove = ref(false);
const showModalBulkDownload = ref(false);

const forceDeleteContext = useFormKitContextById('force-delete');
</script>
