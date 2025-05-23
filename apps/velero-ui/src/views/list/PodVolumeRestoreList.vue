<template>
  <ListHeader>
    <template #bulk-buttons>
      <button
        v-if="can(Action.Delete, Resources.POD_VOLUME_RESTORE.plural)"
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
    <template #filters>
      <SearchFilter :type="Filter.Backup" />
      <SearchFilter :type="Filter.StorageLocation" />
      <SearchFilter :type="Filter.Status" />
    </template>
  </ListHeader>
  <ListContent ref="childListRef" :component="PodVolumeLine" />
  <ListFooter />
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
        >{{ item }}</span>
      </div>
    </template>
  </ModalConfirmation>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
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
import PodVolumeLine from '@velero-ui-app/components/PodVolume/PodVolumeLine.vue';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteManyKubernetesObjects } from '@velero-ui-app/composables/useDeleteManyKubernetesObjects';
import { Resources } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';
import { can } from "@velero-ui-app/utils/policy.utils";
import { Action, Filter, SortBy, SortDirection } from "@velero-ui/shared-types";
import SearchFilter from "@velero-ui-app/components/Search/SearchFilter.vue";
import { useFilters } from "@velero-ui-app/composables/search/useFilters";

const { t } = useI18n();

const listStore = useListStore();
const { mutate: remove, isPending: isLoadingDeleting } =
  useDeleteManyKubernetesObjects(Resources.POD_VOLUME_RESTORE);

const childListRef = ref(null);

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
      name: 'list.header.fromBackup',
    },
    {
      name: 'storageLocations.title',
      sort: {
        type: SortBy.StorageLocation,
        selected: false,
      },
    },
    {
      name: 'list.header.volume',
    },
    {
      name: 'list.header.status',
    },
    {
      name: 'list.header.actions',
    },
  ]),
);

const showModalBulkRemove = ref(false);

const bulkRemove = () => {
  remove({ names: childListRef?.value.getCheckedItems() });
  childListRef?.value.resetCheckedItems();
};
</script>
