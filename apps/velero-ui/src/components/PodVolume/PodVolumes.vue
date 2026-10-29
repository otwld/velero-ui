<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex flex-wrap items-center gap-2">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('podVolumes.title') }}
      </h3>
      <Badge :prefix-icon="faCubes" :text="String(count)" color="blue" />
      <Badge :prefix-icon="faSquareBinary" :text="sizeLabel" color="blue" />
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
      <div
        v-if="snapshotIssues.length"
        role="status"
        class="text-sm text-amber-700 dark:text-amber-300"
      >
        <p>{{ t('podVolumes.partial') }}</p>
        <p
          v-for="issue in snapshotIssues"
          :key="`${issue.source}:${issue.reason}`"
        >
          {{ t(`podVolumes.sources.${issue.source}`) }}:
          {{
            t(
              issue.reason === 'unavailable'
                ? 'podVolumes.unavailable'
                : 'podVolumes.sourceError'
            )
          }}
        </p>
      </div>
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
  type BackupSnapshotsResult,
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
    uid.value,
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
      await axios.get<BackupSnapshotsResult>(
        `${Resources.BACKUP.route}/${name.value}/snapshots`
      )
    ).data,
  placeholderData: (previous, query) =>
    query?.queryKey[1] === name.value && query?.queryKey[2] === uid.value
      ? previous
      : undefined,
  refetchInterval: computed(() =>
    props.backup?.status?.completionTimestamp ? false : 5000
  ),
  refetchOnWindowFocus: false,
  retry: 1,
});
const snapshotItems = computed(() =>
  allowedSnapshots ? snapshots.data.value?.items || [] : []
);
const snapshotIssues = computed(() =>
  allowedSnapshots ? snapshots.data.value?.issues || [] : []
);
const snapshotFor = (operation: V2alpha1DataUpload | V2alpha1DataDownload) => {
  if (!('sourcePVC' in operation.spec)) return undefined;
  const spec = operation.spec;
  const upload = operation as V2alpha1DataUpload;
  return snapshotItems.value.find(
    (snapshot) =>
      snapshot.type === 'CSI' &&
      snapshot.namespace ===
        (spec.csiSnapshot?.volumeSnapshotNamespace || spec.sourceNamespace) &&
      (snapshot.name === spec.csiSnapshot?.volumeSnapshot ||
        (snapshot.snapshotDataMoved &&
          ((!!snapshot.dataMoverSnapshotID &&
            snapshot.dataMoverSnapshotID === upload.status?.snapshotID) ||
            snapshot.volume === spec.sourcePVC)))
  );
};
const standaloneSnapshots = computed(() =>
  snapshotItems.value.filter(
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
const unknownSize = computed(
  () =>
    [...filesystem.data.value, ...movers.data.value].some(
      (operation) => operation.status?.progress?.bytesDone === undefined
    ) ||
    standaloneSnapshots.value.some((snapshot) => snapshot.size === undefined)
);
const sizeLabel = computed(() => {
  if (unknownSize.value) {
    return totalSize.value > 0
      ? `${convertBytes(totalSize.value)} + ${t('podVolumes.unknownSize')}`
      : t('podVolumes.unknownSize');
  }
  if (
    snapshotIssues.value.length ||
    snapshots.error.value ||
    filesystem.error.value ||
    movers.error.value
  ) {
    return totalSize.value > 0
      ? `${convertBytes(totalSize.value)} (${t('podVolumes.knownSize')})`
      : t('podVolumes.unknownSize');
  }
  return convertBytes(totalSize.value);
});
const loading = computed(
  () =>
    filesystem.isFetching.value ||
    movers.isFetching.value ||
    snapshots.isFetching.value
);
const hasError = computed(
  () =>
    !!(
      filesystem.error.value ||
      movers.error.value ||
      snapshots.error.value ||
      snapshotIssues.value.length
    )
);
</script>
