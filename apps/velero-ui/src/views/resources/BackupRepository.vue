<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <BackupRepositoryActions :repository="data"></BackupRepositoryActions>
      <BackupRepositoryStatus :repository="data"></BackupRepositoryStatus>
      <BackupRepositoryDetails :spec="data?.spec"></BackupRepositoryDetails>
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
import BackupRepositoryActions from '@velero-ui-app/components/BackupRepository/BackupRepositoryActions.vue';
import BackupRepositoryStatus from '@velero-ui-app/components/BackupRepository/BackupRepositoryStatus.vue';
import BackupRepositoryDetails from '@velero-ui-app/components/BackupRepository/BackupRepositoryDetails.vue';
import { useKubernetesObject } from '@velero-ui-app/composables/useKubernetesObject';
import { Resources, type V1BackupRepository } from '@velero-ui/velero';

const router: Router = useRouter();

const { data } = useKubernetesObject<V1BackupRepository>(
  Resources.BACKUP_REPOSITORY,
  router.currentRoute.value.params.name,
);
</script>
