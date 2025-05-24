<template>
  <div class="grid grid-cols-1 px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flex flex-col">
        <div class="flex items-center">
          <h3 class="text-xl font-semibold dark:text-white">
            {{ t('backups.title') }}
          </h3>
          <Badge
            :prefix-icon="faFloppyDisk"
            :text="total.toString()"
            class="ml-4"
            color="blue"
          />
        </div>
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
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { storeToRefs } from 'pinia';
import Badge from '@velero-ui-app/components/Badge.vue';
import { useFilters } from '@velero-ui-app/composables/search/useFilters';
import { Filter } from '@velero-ui/shared-types';

const { t } = useI18n();
const { set } = useFilters();

const router: Router = useRouter();

const listStore = useListStore();
const { total } = storeToRefs(listStore);

listStore.setObjectType(Resources.BACKUP);
set(Filter.Search, router.currentRoute.value.params.name as string, true);
</script>
