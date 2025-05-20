<template>
  <Resource :error="!!error" :page="Pages.POD_VOLUME_BACKUPS">
    <template #left>
      <PodVolumeActions :pod-volume="data" :type="type" />
      <PodVolumeStatus :pod-volume="data" />
      <PodVolumeDetails :spec="data?.spec" />
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
import {
  Resources,
  type V1PodVolumeBackup,
  type V1PodVolumeRestore,
} from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import PodVolumeActions from '@velero-ui-app/components/PodVolume/PodVolumeActions.vue';
import PodVolumeStatus from '@velero-ui-app/components/PodVolume/PodVolumeStatus.vue';
import PodVolumeDetails from '@velero-ui-app/components/PodVolume/PodVolumeDetails.vue';
import Resource from '@velero-ui-app/components/Resource/Resource.vue';

const router: Router = useRouter();

const type =
  router.currentRoute.value.name === Pages.POD_VOLUME_BACKUP.name
    ? Resources.POD_VOLUME_BACKUP
    : Resources.POD_VOLUME_RESTORE;

const { on, off, data, error } = useKubernetesWatchObject<
  V1PodVolumeBackup | V1PodVolumeRestore
>(type, router.currentRoute.value.params.name as string);

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
