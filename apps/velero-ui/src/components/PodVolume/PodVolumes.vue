<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex flex-wrap items-center gap-2">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('podVolumes.title') }}
      </h3>
      <Badge :prefix-icon="faCubes" :text="String(count)" color="blue" />
      <Badge
        :prefix-icon="faSquareBinary"
        :text="convertBytes(totalSize)"
        color="blue"
      />
    </div>
    <div class="overflow-auto mt-2 pr-2 max-h-[300px]">
      <Skeleton v-if="loading && count === 0" height="3" width="96" />
      <p
        v-if="filesystem.error.value"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ t('podVolumes.filesystemError') }}
      </p>
      <p
        v-if="movers.error.value"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ t('podVolumes.dataMoverError') }}
      </p>
      <p
        v-if="snapshots.error.value"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ t('podVolumes.snapshotError') }}
      </p>
      <p
        v-if="!loading && !hasError && count === 0"
        class="text-gray-500 dark:text-gray-400"
      >
        {{ t('global.noData') }}
      </p>
      <PodVolumeLine
        v-for="pod in filesystem.data.value"
        :key="pod.metadata?.uid || pod.metadata?.name"
        :pod-volume="pod"
      />
      <DataMoverLine
        v-for="mover in movers.data.value"
        :key="mover.metadata?.uid || mover.metadata?.name"
        :operation="mover"
        :snapshot="snapshotFor(mover)"
      />
      <SnapshotLine
        v-for="snapshot in standaloneSnapshots"
        :key="`${snapshot.type}:${snapshot.namespace}:${snapshot.name}`"
        :snapshot="snapshot"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  Resources,
  type BackupSnapshot,
  type V1Backup,
  type V1PodVolumeBackup,
  type V1PodVolumeRestore,
  type V2alpha1DataUpload,
  type V2alpha1DataDownload,
} from '@velero-ui/velero';
import { useRoute } from 'vue-router';
import { computed, inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { faCubes, faSquareBinary } from '@fortawesome/free-solid-svg-icons';
import { Action } from '@velero-ui/shared-types';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { can } from '@velero-ui-app/utils/policy.utils';
import { convertBytes } from '@velero-ui-app/utils/string.utils';
import { useVolumeOperations } from '@velero-ui-app/composables/useVolumeOperations';
import PodVolumeLine from './PodVolumeShortLine.vue';
import DataMoverLine from './DataMoverLine.vue';
import SnapshotLine from './SnapshotLine.vue';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import Badge from '@velero-ui-app/components/Badge.vue';

const props = defineProps<{ backup?: V1Backup; parentUid?: string }>();
const { t } = useI18n();
const route = useRoute();
const name = computed(() => route.params.name as string);
const isBackup = route.name === Pages.BACKUP.name;
const uid = computed(() => props.backup?.metadata?.uid || props.parentUid);
const axios = inject('axios') as AxiosInstance;
const podType = isBackup
  ? Resources.POD_VOLUME_BACKUP
  : Resources.POD_VOLUME_RESTORE;
const moverType = isBackup ? Resources.DATA_UPLOAD : Resources.DATA_DOWNLOAD;
const filesystem = useVolumeOperations<V1PodVolumeBackup | V1PodVolumeRestore>(
  podType,
  name,
  isBackup,
  can(Action.Read, podType.plural),
  uid
);
const movers = useVolumeOperations<V2alpha1DataUpload | V2alpha1DataDownload>(
  moverType,
  name,
  isBackup,
  can(Action.Read, moverType.plural),
  uid
);
const allowedSnapshots = isBackup && can(Action.Read, Resources.BACKUP.plural);
const snapshotCount = computed(
  () =>
    (props.backup?.status?.csiVolumeSnapshotsAttempted || 0) +
    (props.backup?.status?.volumeSnapshotsAttempted || 0)
);
const snapshots = useQuery({
  queryKey: computed(() => [
    'backup-snapshots',
    name.value,
    props.backup?.status?.phase,
    snapshotCount.value,
  ]),
  enabled: computed(
    () =>
      allowedSnapshots &&
      !!props.backup &&
      (snapshotCount.value > 0 || props.backup.spec?.snapshotVolumes !== false)
  ),
  queryFn: async () =>
    (
      await axios.get<BackupSnapshot[]>(
        `${Resources.BACKUP.route}/${name.value}/snapshots`
      )
    ).data,
  initialData: [] as BackupSnapshot[],
  refetchInterval: computed(() =>
    props.backup?.status?.completionTimestamp ? false : 5000
  ),
  refetchOnWindowFocus: false,
  retry: 1,
});
const snapshotFor = (operation: V2alpha1DataUpload | V2alpha1DataDownload) => {
  if (!('sourcePVC' in operation.spec)) return undefined;
  const spec = operation.spec;
  return snapshots.data.value.find(
    (snapshot) =>
      snapshot.type === 'CSI' &&
      snapshot.name === spec.csiSnapshot?.volumeSnapshot &&
      snapshot.namespace === (spec.csiSnapshot?.volumeSnapshotNamespace || spec.sourceNamespace)
  );
};
const standaloneSnapshots = computed(() =>
  snapshots.data.value.filter(
    (snapshot) =>
      !movers.data.value.some((mover) => snapshotFor(mover) === snapshot)
  )
);
const count = computed(
  () =>
    filesystem.data.value.length +
    movers.data.value.length +
    standaloneSnapshots.value.length
);
const totalSize = computed(
  () =>
    [...filesystem.data.value, ...movers.data.value].reduce(
      (total, operation) =>
        total + (operation.status?.progress?.bytesDone || 0),
      0
    ) +
    standaloneSnapshots.value.reduce(
      (total, snapshot) => total + (snapshot.size || 0),
      0
    )
);
const loading = computed(
  () =>
    filesystem.isFetching.value ||
    movers.isFetching.value ||
    snapshots.isFetching.value
);
const hasError = computed(
  () =>
    !!(filesystem.error.value || movers.error.value || snapshots.error.value)
);
</script>
