<template>
  <ListHeader>
    <template #bulk-buttons>
      <BulkButton
        v-if="can(Action.Delete, Resources.SERVER_STATUS_REQUEST.plural)"
        :icon="faTrashCan"
        :loading="isLoadingDeleting"
        @click="showModalBulkRemove = !showModalBulkRemove"
      />
    </template>
    <template #filters>
      <SearchFilter :type="Filter.Status" />
    </template>
  </ListHeader>
  <ListContent :component="ServerStatusRequestLine" />
  <ListFooter />
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
    </template>
  </ModalConfirmation>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import ServerStatusRequestLine from '@velero-ui-app/components/Request/ServerStatusRequestLine.vue';
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
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action, Filter, SortBy, SortDirection } from '@velero-ui/shared-types';
import SearchFilter from '@velero-ui-app/components/Search/SearchFilter.vue';
import { storeToRefs } from 'pinia';
import BulkButton from '@velero-ui-app/components/BulkButton.vue';

const { t } = useI18n();

const listStore = useListStore();
const { checkedItems } = storeToRefs(listStore);

const { mutate: remove, isPending: isLoadingDeleting } =
  useDeleteManyKubernetesObjects(Resources.SERVER_STATUS_REQUEST);

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
      name: 'list.header.processedOn',
      sort: {
        type: SortBy.ProcessedTimestamp,
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

const showModalBulkRemove = ref(false);
</script>
