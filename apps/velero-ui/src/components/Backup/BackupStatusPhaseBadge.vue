<template>
  <span
    v-if="status"
    :class="getClass()"
    class="text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded"
  >
    {{ status }}</span
  >
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { V1BackupPhase } from '@velero-ui/velero';

const props = defineProps({
  status: String as PropType<V1BackupPhase>,
});

const getClass = () => {
  switch (props.status) {
    case V1BackupPhase.Completed:
      return [
        'bg-green-100',
        'text-green-800',
        'dark:bg-green-900',
        'dark:text-green-300',
      ];
    case (V1BackupPhase.InProgress,
    V1BackupPhase.WaitingForPluginOperations,
    V1BackupPhase.Finalizing):
      return [
        'bg-yellow-100',
        'text-yellow-800',
        'dark:bg-yellow-900',
        'dark:text-yellow-300',
      ];
    case (V1BackupPhase.WaitingForPluginOperationsPartiallyFailed,
    V1BackupPhase.FinalizingPartiallyFailed,
    V1BackupPhase.PartiallyFailed):
      return [
        'bg-orange-100',
        'text-orange-800',
        'dark:bg-orange-900',
        'dark:text-orange-300',
      ];
    case (V1BackupPhase.Failed, V1BackupPhase.Deleting):
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
