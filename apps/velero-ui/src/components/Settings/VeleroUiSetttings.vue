<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="mb-4 rounded-lg w-20 h-20 sm:mb-0 xl:mb-4 2xl:mb-0 dark:text-white"
      >
        <path
          d="M4.08 5.227A3 3 0 0 1 6.979 3H17.02a3 3 0 0 1 2.9 2.227l2.113 7.926A5.228 5.228 0 0 0 18.75 12H5.25a5.228 5.228 0 0 0-3.284 1.153L4.08 5.227Z"
        />
        <path
          fill-rule="evenodd"
          d="M5.25 13.5a3.75 3.75 0 1 0 0 7.5h13.5a3.75 3.75 0 1 0 0-7.5H5.25Zm10.5 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3.75-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          clip-rule="evenodd"
        />
      </svg>

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

export default defineComponent({
  name: 'VeleroUiSettings',
  setup() {
    const settingsStore = useSettingsStore();
    const { veleroUi } = storeToRefs(settingsStore);

    return { settingsStore, veleroUi };
  },
  beforeMount() {
    this.settingsStore.fetchVeleroUi();
  },
});
</script>
