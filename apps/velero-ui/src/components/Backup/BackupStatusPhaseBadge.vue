<template>
  <span
    :class="getClass()"
    class="text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded"
  >
    {{ t(`resource.phase.${status}`) }}</span
  >
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { V1BackupPhase } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  status: {
    type: String as PropType<V1BackupPhase>,
    required: false,
    default: undefined,
  },
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
    case V1BackupPhase.InProgress:
    case V1BackupPhase.WaitingForPluginOperations:
    case V1BackupPhase.Finalizing:
      return [
        'bg-yellow-100',
        'text-yellow-800',
        'dark:bg-yellow-900',
        'dark:text-yellow-300',
        'animate-pulse',
      ];
    case V1BackupPhase.WaitingForPluginOperationsPartiallyFailed:
    case V1BackupPhase.FinalizingPartiallyFailed:
    case V1BackupPhase.PartiallyFailed:
      return [
        'bg-orange-100',
        'text-orange-800',
        'dark:bg-orange-900',
        'dark:text-orange-300',
      ];
    case V1BackupPhase.Deleting:
    case V1BackupPhase.Failed:
    case V1BackupPhase.FailedValidation:
      return [
        'bg-red-100',
        'text-red-800',
        'dark:bg-red-900',
        'dark:text-red-300',
      ];
    case undefined:
    case null:
      return [
        'bg-gray-100',
        'text-gray-800',
        'dark:bg-gray-900',
        'dark:text-gray-300',
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
