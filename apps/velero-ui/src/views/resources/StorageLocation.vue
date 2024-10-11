<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <StorageLocationActions :location="data"></StorageLocationActions>
      <StorageLocationStatus :location="data"></StorageLocationStatus>
      <StorageLocationDetails :location="data"></StorageLocationDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="data"></Describe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Describe from '@velero-ui-app/components/Describe.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import StorageLocationActions from '@velero-ui-app/components/StorageLocation/StorageLocationActions.vue';
import StorageLocationStatus from '@velero-ui-app/components/StorageLocation/StorageLocationStatus.vue';
import StorageLocationDetails from '@velero-ui-app/components/StorageLocation/StorageLocationDetails.vue';
import { useKubernetesObject } from '@velero-ui-app/composables/useKubernetesObject';
import { Resources, type V1BackupStorageLocation } from '@velero-ui/velero';

const router: Router = useRouter();

const { data } = useKubernetesObject<V1BackupStorageLocation>(
  Resources.BACKUP_STORAGE_LOCATION,
  router.currentRoute.value.params.name,
);
</script>
