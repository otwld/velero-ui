<template>
  <Resource :error="!!error" :page="Pages.BACKUP_REPOSITORIES">
    <template #left>
      <BackupRepositoryActions :repository="data" />
      <BackupRepositoryStatus :repository="data" />
      <BackupRepositoryDetails :spec="data?.spec" />
    </template>
    <template #right>
      <ResourceManifest :data="data" />
    </template>
  </Resource>
</template>

<script lang="ts" setup>
import ResourceManifest from '@velero-ui-app/components/Resource/ResourceManifest.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import BackupRepositoryActions from '@velero-ui-app/components/BackupRepository/BackupRepositoryActions.vue';
import BackupRepositoryStatus from '@velero-ui-app/components/BackupRepository/BackupRepositoryStatus.vue';
import BackupRepositoryDetails from '@velero-ui-app/components/BackupRepository/BackupRepositoryDetails.vue';
import { Resources, type V1BackupRepository } from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import Resource from '@velero-ui-app/components/Resource/Resource.vue';

const router: Router = useRouter();

const { on, off, data, error } = useKubernetesWatchObject<V1BackupRepository>(
  Resources.BACKUP_REPOSITORY,
  router.currentRoute.value.params.name as string
);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
