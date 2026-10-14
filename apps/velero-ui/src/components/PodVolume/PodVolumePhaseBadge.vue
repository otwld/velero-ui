<template>
  <Badge
    v-if="status"
    :text="t(`resource.phase.${status}`)"
    :color="color"
    :class="{
      'animate-pulse': status === 'InProgress' || status === 'Canceling',
    }"
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  V1PodVolumeBackupPhase,
  V1PodVolumeRestorePhase,
  V2alpha1DataUploadPhase,
  V2alpha1DataDownloadPhase,
} from '@velero-ui/velero';
import Badge from '@velero-ui-app/components/Badge.vue';

const props = defineProps<{
  status?:
    | V1PodVolumeBackupPhase
    | V1PodVolumeRestorePhase
    | V2alpha1DataUploadPhase
    | V2alpha1DataDownloadPhase;
}>();
const { t } = useI18n();
const color = computed(() => {
  switch (props.status) {
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
