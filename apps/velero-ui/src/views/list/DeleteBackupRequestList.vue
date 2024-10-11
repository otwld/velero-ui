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
  </ListHeader>
  <ListContent :component="DeleteBackupRequestLine"></ListContent>
  <ListFooter></ListFooter>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import DeleteBackupRequestLine from '@velero-ui-app/components/Request/DeleteBackupRequestLine.vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ListHeader from '@velero-ui-app/components/List/ListHeader.vue';
import ListFooter from '@velero-ui-app/components/List/ListFooter.vue';
import ListContent from '@velero-ui-app/components/List/ListContent.vue';

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
      name: 'Target',
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
</script>
