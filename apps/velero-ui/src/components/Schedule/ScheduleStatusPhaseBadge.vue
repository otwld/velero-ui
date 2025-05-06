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
import { V1SchedulePhase } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  status: {type: String as PropType<V1SchedulePhase>, required: true },
});

const getClass = () => {
  switch (props.status) {
    case V1SchedulePhase.Enabled:
      return [
        'bg-green-100',
        'text-green-800',
        'dark:bg-green-900',
        'dark:text-green-300',
      ];
    case V1SchedulePhase.FailedValidation:
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
