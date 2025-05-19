<template>
  <div v-if="!error" class="min-h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <StorageLocationActions :location="data" />
        <StorageLocationStatus :location="data" />
        <StorageLocationDetails :location="data" />
      </div>
      <div class="col-span-2">
        <Describe :data="data" />
      </div>
    </div>
  </div>
  <ResourceNotFound v-if="error" :page="Pages.STORAGE_LOCATIONS" />
</template>

<script lang="ts" setup>
import Describe from '@velero-ui-app/components/Describe.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import StorageLocationActions from '@velero-ui-app/components/StorageLocation/StorageLocationActions.vue';
import StorageLocationStatus from '@velero-ui-app/components/StorageLocation/StorageLocationStatus.vue';
import StorageLocationDetails from '@velero-ui-app/components/StorageLocation/StorageLocationDetails.vue';
import { Resources, type V1BackupStorageLocation } from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import ResourceNotFound from '@velero-ui-app/components/ResourceNotFound.vue';

const router: Router = useRouter();

const { on, off, data, error } =
  useKubernetesWatchObject<V1BackupStorageLocation>(
    Resources.BACKUP_STORAGE_LOCATION,
    router.currentRoute.value.params.name as string,
  );

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
