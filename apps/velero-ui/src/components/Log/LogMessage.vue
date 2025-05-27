<template>
  <div class="cursor-pointer" @click="toggleDropdown()">
    {{ line.message }}
    <div v-if="!hiddenDropdown" class="mt-2 space-x-2 space-y-2">
      <p v-if="line.logSource" class="text-xs italic text-gray-500">
        {{ line.logSource}}
      </p>
      <p v-if="line.error" class="text-sm text-red-500">
        {{ line.error}}
      </p>
      <Badge
        v-if="line.plugin"
        :prefix-icon="faBox"
        :text="line.plugin"
        color="gray"
      />
      <Badge
        v-if="line.backupStorageLocation"
        :prefix-icon="faServer"
        :text="line.backupStorageLocation"
        color="gray"
      />
      <Badge
        v-if="line.volumeSnapshotLocation"
        :prefix-icon="faDatabase"
        :text="line.volumeSnapshotLocation"
        color="gray"
      />
      <Badge
        v-if="line.backup"
        :prefix-icon="faFloppyDisk"
        :text="line.backup"
        color="gray"
      />
      <Badge
        v-if="line.backupRepository"
        :prefix-icon="faFolderTree"
        :text="line.backupRepository"
        color="gray"
      />
      <Badge
        v-if="line.podVolumeBackup"
        :prefix-icon="faCube"
        :text="line.podVolumeBackup"
        color="gray"
      />
      <Badge
        v-if="line.podVolumeRestore"
        :prefix-icon="faCube"
        :text="line.podVolumeRestore"
        color="gray"
      />
      <Badge
        v-if="line.serverStatusRequest"
        :prefix-icon="faFileWaveform"
        :text="line.serverStatusRequest"
        color="gray"
      />
      <Badge
        v-if="line.downloadRequest"
        :prefix-icon="faFileArrowDown"
        :text="line.downloadRequest"
        color="gray"
      />
      <Badge
        v-if="line.deleteBackupRequest"
        :prefix-icon="faFileExcel"
        :text="line.deleteBackupRequest"
        color="gray"
      />
      <Badge
        v-if="line.namespace"
        :prefix-icon="faLayerGroup"
        :text="line.namespace"
        color="gray"
      />
      <Badge
        v-if="line.group"
        :prefix-icon="faObjectGroup"
        :text="line.group"
        color="gray"
      />
      <Badge
        v-if="line.resource"
        :prefix-icon="faPuzzlePiece"
        :text="line.resource"
        color="gray"
      />
      <Badge
        v-if="line.name"
        :prefix-icon="faA"
        :text="line.name"
        color="gray"
      />
      <Badge
        v-if="line.expiration"
        :prefix-icon="faHourglass"
        :text="convertTimestampToDate(line.expiration)"
        color="gray"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, ref } from 'vue';
import type { VeleroLog } from '@velero-ui/shared-types';
import Badge from '@velero-ui-app/components/Badge.vue';
import {
  faA,
  faBox,
  faCube, faDatabase, faFileArrowDown, faFileExcel, faFileWaveform,
  faFloppyDisk, faFolderTree, faHourglass,
  faLayerGroup,
  faObjectGroup,
  faPuzzlePiece,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { convertTimestampToDate, parseTimeString } from "@velero-ui-app/utils/date.utils";

const props = defineProps({
  line: {
    type: Object as PropType<VeleroLog>,
    required: true,
    default: undefined,
  },
});

const hiddenDropdown = ref(true);

const toggleDropdown = () => (hiddenDropdown.value = !hiddenDropdown.value);
</script>
