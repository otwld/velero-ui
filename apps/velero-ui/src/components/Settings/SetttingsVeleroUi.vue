<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon :icon="faHardDrive" class="w-16 h-16 dark:text-white" />
      <div>
        <h3
          class="flex items-center mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          Velero UI
          <div
            v-if="veleroUi?.connected"
            class="h-2.5 w-2.5 rounded-full bg-green-400 ml-2"
          ></div>
          <div
            v-if="!veleroUi?.connected"
            class="h-2.5 w-2.5 rounded-full bg-red-500 ml-2"
          ></div>
        </h3>
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">
          {{ veleroUi?.mode }}
          <div
            v-if="!veleroUi"
            class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
          ></div>
        </div>
        <div class="mb-1 text-xs text-gray-500 dark:text-gray-400">
          {{ veleroUi?.version }}
          <div
            v-if="!veleroUi"
            class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-72 mb-4"
          ></div>
        </div>
        <div class="flex items-center space-x-4"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../stores/settings.store';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHardDrive } from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
  name: 'SetttingsVeleroUi',
  components: { FontAwesomeIcon },
  setup() {
    const settingsStore = useSettingsStore();
    const { veleroUi } = storeToRefs(settingsStore);

    return { settingsStore, veleroUi };
  },
  data: () => ({
    faHardDrive,
  }),
  beforeMount() {
    this.settingsStore.fetchVeleroUi();
  },
});
</script>
