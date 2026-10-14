<template>
  <Resource
    :error="!!error"
    :page="backup ? Pages.POD_VOLUME_BACKUPS : Pages.POD_VOLUME_RESTORES"
  >
    <template #left>
      <template v-if="dataMover">
        <ResourceActions
          :icon="faCube"
          :name="data?.metadata?.name"
          :uid="data?.metadata?.uid"
        />
        <div
          v-if="mover"
          class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
        >
          <DataMoverLine :operation="mover" />
        </div>
      </template>
      <template v-else>
        <PodVolumeActions :pod-volume="filesystem" :type="type" />
        <PodVolumeStatus
          :pod-volume="filesystem"
        />
        <PodVolumeDetails :spec="filesystem?.spec" />
      </template>
    </template>
    <template #right>
      <ResourceManifest v-if="data" :data="data" />
    </template>
  </Resource>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import {
  Resources,
  type V1PodVolumeBackup,
  type V1PodVolumeRestore,
  type V2alpha1DataUpload,
  type V2alpha1DataDownload,
} from '@velero-ui/velero';
import { useKubernetesWatchObject } from '@velero-ui-app/composables/useKubernetesWatchObject';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { podVolumeResourceForRoute } from '@velero-ui-app/utils/pod-volume-list.utils';
import type { VolumeOperation } from '@velero-ui-app/utils/volume.utils';
import PodVolumeActions from '@velero-ui-app/components/PodVolume/PodVolumeActions.vue';
import PodVolumeStatus from '@velero-ui-app/components/PodVolume/PodVolumeStatus.vue';
import PodVolumeDetails from '@velero-ui-app/components/PodVolume/PodVolumeDetails.vue';
import DataMoverLine from '@velero-ui-app/components/PodVolume/DataMoverLine.vue';
import ResourceManifest from '@velero-ui-app/components/Resource/ResourceManifest.vue';
import ResourceActions from '@velero-ui-app/components/Resource/ResourceActions.vue';
import Resource from '@velero-ui-app/components/Resource/Resource.vue';

const route = useRoute();
const backup = route.name === Pages.POD_VOLUME_BACKUP.name;
const type =
  podVolumeResourceForRoute(backup, route.query.resource as string) ||
  (backup ? Resources.POD_VOLUME_BACKUP : Resources.POD_VOLUME_RESTORE);
const dataMover = [
  Resources.DATA_UPLOAD.plural,
  Resources.DATA_DOWNLOAD.plural,
].includes(type.plural);
const { on, off, data, error } = useKubernetesWatchObject<VolumeOperation>(
  type,
  route.params.name as string
);
const filesystem = computed(() =>
  dataMover ? undefined : (data.value as V1PodVolumeBackup | V1PodVolumeRestore)
);
const mover = computed(() =>
  dataMover
    ? (data.value as V2alpha1DataUpload | V2alpha1DataDownload)
    : undefined
);
onBeforeMount(on);
onBeforeUnmount(off);
</script>
