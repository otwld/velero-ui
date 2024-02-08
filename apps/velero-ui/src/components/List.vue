<template>
  <ListHeader
    @onRefresh="emit('onRefresh')"
    @onSearchInput="(value) => emit('onSearchInput', value)"
  ></ListHeader>
  <ListContent
    :headers="headers"
    :data="data"
    :component="component"
  ></ListContent>
  <ListFooter
    :total="total"
    :limit="limit"
    :offset="offset"
    @onNext="emit('onNext')"
    @onPrevious="emit('onPrevious')"
  ></ListFooter>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type {
  V1Backup,
  V1BackupStorageLocation,
  V1Restore,
  V1Schedule,
  V1VolumeSnapshotLocation,
} from '@velero-ui/velero';
import ListHeader from './List/ListHeader.vue';
import ListFooter from './List/ListFooter.vue';
import ListContent from './List/ListContent.vue';

const emit = defineEmits([
  'onNext',
  'onPrevious',
  'onSearchInput',
  'onRefresh',
]);

defineProps({
  component: Object,
  data: Array as PropType<
    | V1Backup[]
    | V1Schedule[]
    | V1Restore
    | V1BackupStorageLocation[]
    | V1VolumeSnapshotLocation
  >,
  loading: Boolean,
  headers: Array as PropType<string[]>,
  offset: Number,
  limit: Number,
  total: Number,
});
</script>
