<template>
  <div class="">
    <ListHeader
      :loading="loading"
      @onRefresh="emit('onRefresh')"
      @onNew=""
    ></ListHeader>
    <ListContent
      :headers="headers"
      :data="data"
      :loading="loading"
      :component="component"
    ></ListContent>
    <ListFooter :loading="loading" @onRefresh="emit('onRefresh')"></ListFooter>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type {
  V1Backup,
  V1BackupRepository,
  V1BackupStorageLocation,
  V1DeleteBackupRequest,
  V1DownloadRequest,
  V1Restore,
  V1Schedule,
  V1ServerStatusRequest,
  V1VolumeSnapshotLocation,
} from '@velero-ui/velero';
import ListHeader from './ListHeader.vue';
import ListFooter from './ListFooter.vue';
import ListContent from './ListContent.vue';

const emit = defineEmits(['onSearchInput', 'onRefresh']);

defineProps({
  component: Object,
  data: Array as PropType<
    | V1Backup[]
    | V1Schedule[]
    | V1Restore[]
    | V1BackupStorageLocation[]
    | V1VolumeSnapshotLocation[]
    | V1DownloadRequest[]
    | V1ServerStatusRequest[]
    | V1DeleteBackupRequest[]
    | V1BackupRepository[]
  >,
  loading: Boolean,
  headers: Array as PropType<string[]>,
});
</script>
