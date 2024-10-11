<template>
  <div
    class="p-4 text-sm text-white bg-gray-900 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-white max-h-[500px] overflow-auto"
  >
    <div v-if="serverLogs.length > 0" class="flex-col">
      <p v-for="(line, index) of serverLogs" :key="`line-${index}`">
        {{ line }}
      </p>
    </div>
    <div v-if="serverLogs?.length === 0" class="inline-flex items-center">
      <FontAwesomeIcon :icon="faInfoCircle" class="w-4 h-4" />
      <p class="ml-2">No logs to show!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSettingsVeleroServerLogs } from '@velero-ui-app/use/settings/useSettingsVeleroServerLogs';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useSettingsStore } from '@velero-ui-app/stores/settings.store';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();
const { serverLogs } = storeToRefs(settingsStore);

const { on, off } = useSettingsVeleroServerLogs();

onBeforeMount(() => on());
onBeforeUnmount(() => off());
</script>
