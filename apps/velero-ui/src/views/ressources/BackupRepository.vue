<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <BackupRepositoryActions :repository="repository"></BackupRepositoryActions>
      <BackupRepositoryStatus :repository="repository"></BackupRepositoryStatus>
      <BackupRepositoryDetails :spec="repository?.spec"></BackupRepositoryDetails>
    </div>
    <div class="col-span-2">
      <Describe :data="repository"></Describe>
    </div>
  </div>
</template>

<script setup lang="ts">
import Describe from '@velero-ui-app/components/Describe.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { onBeforeMount, toRef } from 'vue';
import { useBackupRepositoryStore } from '@velero-ui-app/stores/backup-repository.store';
import { useBackupRepositoryGet } from '@velero-ui-app/use/backup-repository/useBackupRepositoryGet';
import BackupRepositoryActions from '@velero-ui-app/components/BackupRepository/BackupRepositoryActions.vue';
import BackupRepositoryStatus from "@velero-ui-app/components/BackupRepository/BackupRepositoryStatus.vue";
import BackupRepositoryDetails from "@velero-ui-app/components/BackupRepository/BackupRepositoryDetails.vue";

const backupRepositoryStore = useBackupRepositoryStore();
const { repository } = storeToRefs(backupRepositoryStore);

const router: Router = useRouter();

const { get } = useBackupRepositoryGet(
  toRef(router.currentRoute.value.params.name)
);

onBeforeMount(() => get());
</script>
