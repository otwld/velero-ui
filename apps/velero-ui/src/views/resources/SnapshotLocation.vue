<template>
  <Resource :error="!!error" :page="Pages.SNAPSHOT_LOCATIONS">
    <template #left>
      <SnapshotLocationActions :location="data" />
    </template>
    <template #right>
      <ResourceManifest :data="data" />
    </template>
  </Resource>
</template>

<script lang="ts" setup>
import ResourceManifest from '@velero-ui-app/components/Resource/ResourceManifest.vue';
import SnapshotLocationActions from '@velero-ui-app/components/SnapshotLocation/SnapshotLocationActions.vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { Resources, type V1VolumeSnapshotLocation } from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import Resource from '@velero-ui-app/components/Resource/Resource.vue';

const router: Router = useRouter();

const { on, off, data, error } =
  useKubernetesWatchObject<V1VolumeSnapshotLocation>(
    Resources.VOLUME_SNAPSHOT_LOCATION,
    router.currentRoute.value.params.name as string
  );

onBeforeMount((): void => on());
onBeforeUnmount((): void => off());
</script>
