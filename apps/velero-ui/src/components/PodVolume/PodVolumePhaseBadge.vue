<template>
  <span
    v-if="status"
    :class="getClass()"
    class="text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded"
  >
    {{ t(`resource.phase.${status}`) }}</span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import {
  V1PodVolumeBackupPhase,
  V1PodVolumeRestorePhase,
} from '@velero-ui/velero';
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  status: {type: String as PropType<V1PodVolumeBackupPhase | V1PodVolumeRestorePhase>, required: true },
});

const getClass = () => {
  switch (props.status) {
    case V1PodVolumeBackupPhase.Completed:
    case V1PodVolumeRestorePhase.Completed:
      return [
        'bg-green-100',
        'text-green-800',
        'dark:bg-green-900',
        'dark:text-green-300',
      ];
    case V1PodVolumeBackupPhase.InProgress:
    case V1PodVolumeRestorePhase.InProgress:
      return [
        'bg-yellow-100',
        'text-yellow-800',
        'dark:bg-yellow-900',
        'dark:text-yellow-300',
        'animate-pulse',
      ];
    case V1PodVolumeBackupPhase.Failed:
    case V1PodVolumeRestorePhase.Failed:
      return [
        'bg-red-100',
        'text-red-800',
        'dark:bg-red-900',
        'dark:text-red-300',
      ];
    default:
      return [
        'bg-blue-100',
        'text-blue-800',
        'dark:bg-blue-900',
        'dark:text-blue-300',
      ];
  }
};
</script>
