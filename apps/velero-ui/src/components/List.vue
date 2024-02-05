<template>
  <ListHeader></ListHeader>
  <ListContent
    :headers="headers"
    :data="data"
    :component="component"
  ></ListContent>
  <ListFooter :total="total" :limit="limit" :offset="offset"></ListFooter>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
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

export default defineComponent({
  components: {
    ListContent,
    ListFooter,
    ListHeader,
  },
  props: {
    component: Object,
    data: Array as PropType<
      | V1Backup[]
      | V1Schedule[]
      | V1Restore
      | V1BackupStorageLocation[]
      | V1VolumeSnapshotLocation
    >,
    headers: Array as PropType<string[]>,
    offset: Number,
    limit: Number,
    total: Number,
  },
  name: 'List',
  data() {
    return {
    };
  },
  methods: {
    refresh() {
      this.$parent.refresh();
    },
    next() {
      this.$parent.next();
    },
    previous() {
      this.$parent.previous();
    },
    applyNameFilter(name: string) {
      this.$parent.applyNameFilter(name);
    },
  },
});
</script>
