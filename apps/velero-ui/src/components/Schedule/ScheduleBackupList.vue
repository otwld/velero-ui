<template>
  <div class="grid grid-cols-1 px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flex flex-col">
        <h3 class="text-xl font-semibold dark:text-white">
          {{ t('backups.title') }}
        </h3>
        <BackupList />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Resources } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';
import BackupList from '@velero-ui-app/views/list/BackupList.vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { type Router, useRouter } from 'vue-router';

const { t } = useI18n();

const router: Router = useRouter();

const listStore = useListStore();
listStore.setObjectType(Resources.BACKUP);
listStore.applyNameFilter(router.currentRoute.value.params.name as string);
</script>
