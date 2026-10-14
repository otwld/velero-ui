<template>
  <div class="mb-4 text-gray-900 dark:text-white">
    <div class="flex flex-wrap items-center gap-2 font-semibold">
      <span>{{ namespace }}/{{ volume }}</span>
      <Badge :text="t('podVolumes.dataMover')" color="blue" />
      <Badge
        :text="t(`resource.phase.${operation.status?.phase || 'New'}`)"
        :color="phaseColor"
      />
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ operation.metadata?.name }}
    </p>
    <p v-if="snapshotName" class="text-sm break-all">
      {{ t('podVolumes.snapshot') }}: {{ snapshotName }}
      <Badge
        v-if="snapshot"
        :text="t(`resource.phase.${snapshot.phase}`)"
        :color="
          snapshot.phase === 'Failed'
            ? 'red'
            : snapshot.phase === 'Completed'
              ? 'green'
              : 'yellow'
        "
      />
    </p>
    <p
      v-if="upload?.status?.snapshotID || downloadSnapshotID"
      class="text-sm break-all"
    >
      {{ t('podVolumes.snapshotID') }}:
      {{ upload?.status?.snapshotID || downloadSnapshotID }}
    </p>
    <p v-if="snapshot?.snapshotID" class="text-sm break-all">
      {{ t('podVolumes.storageSnapshotID') }}: {{ snapshot.snapshotID }}
    </p>
    <p v-if="snapshot?.contentName" class="text-sm break-all">
      {{ t('podVolumes.snapshotContent') }}: {{ snapshot.contentName }}
    </p>
    <p v-if="snapshot?.driver" class="text-sm">
      {{ t('podVolumes.driver') }}: {{ snapshot.driver }}
    </p>
    <p v-if="operation.spec?.datamover" class="text-sm">
      {{ t('podVolumes.dataMover') }}: {{ operation.spec.datamover }}
    </p>
    <div v-if="operation.status?.progress" class="mt-1">
      <div class="flex justify-between text-xs mb-1">
        <span>{{ t('resource.status.bytes') }}</span>
        <span>{{ convertBytes(operation.status.progress.bytesDone || 0) }} /
          {{ convertBytes(operation.status.progress.totalBytes || 0) }}</span>
      </div>
      <div
        class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
        role="progressbar"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`${namespace}/${volume}`"
      >
        <div
          :style="{ width: `${percent}%` }"
          class="bg-blue-600 h-2.5 rounded-full"
        />
      </div>
    </div>
    <p
      v-if="operation.status?.message"
      class="mt-1 text-sm break-words"
      :class="{
        'text-red-600 dark:text-red-400': operation.status.phase === 'Failed',
      }"
    >
      {{ operation.status.message }}
    </p>
    <p
      v-if="snapshot?.message"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ snapshot.message }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  BackupSnapshot,
  V2alpha1DataUpload,
  V2alpha1DataDownload,
} from '@velero-ui/velero';
import Badge from '@velero-ui-app/components/Badge.vue';
import { convertBytes } from '@velero-ui-app/utils/string.utils';
import { progressPercent } from '@velero-ui-app/utils/volume.utils';

const props = defineProps<{
  operation: V2alpha1DataUpload | V2alpha1DataDownload;
  snapshot?: BackupSnapshot;
}>();
const { t } = useI18n();
const upload = computed(() =>
  'sourcePVC' in props.operation.spec
    ? (props.operation as V2alpha1DataUpload)
    : undefined
);
const download = computed(() =>
  'targetVolume' in props.operation.spec
    ? (props.operation as V2alpha1DataDownload)
    : undefined
);
const namespace = computed(
  () =>
    upload.value?.spec.sourceNamespace ||
    download.value?.spec.targetVolume?.namespace
);
const volume = computed(
  () => upload.value?.spec.sourcePVC || download.value?.spec.targetVolume?.pvc
);
const snapshotName = computed(
  () => upload.value?.spec.csiSnapshot?.volumeSnapshot
);
const downloadSnapshotID = computed(() => download.value?.spec.snapshotID);
const percent = computed(() =>
  progressPercent(props.operation.status?.progress)
);
const phaseColor = computed(() => {
  switch (props.operation.status?.phase) {
    case 'Completed':
      return 'green';
    case 'Failed':
      return 'red';
    case 'Canceled':
      return 'gray';
    case 'InProgress':
    case 'Canceling':
      return 'yellow';
    default:
      return 'blue';
  }
});
</script>
