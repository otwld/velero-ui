<template>
  <div v-if="cluster" class="grid px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
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
            d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z"
          />
          <path
            d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z"
          />
          <path
            d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z"
          />
        </svg>

        <div>
          <h3 class="flex items-center mb-1 text-lg  font-bold text-gray-900 dark:text-white">
            Kubernetes Cluster
            <div
              v-if="cluster.connected"
              class="h-2.5 w-2.5 rounded-full bg-green-400 ml-2"
            ></div>
            <div
              v-if="!cluster.connected"
              class="h-2.5 w-2.5 rounded-full bg-red-500 ml-2"
            ></div>
          </h3>
          <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">
            {{ cluster.server }}
          </div>
          <div class="mb-4 text-xs text-gray-500 dark:text-gray-400">
            {{ cluster.version }}
          </div>
          <div class="flex items-center space-x-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../stores/settings.store';

export default defineComponent({
  name: 'ClusterSettings',
  setup() {
    const settingsStore = useSettingsStore();
    const { cluster } = storeToRefs(settingsStore);

    return { settingsStore, cluster };
  },
  beforeMount() {
    this.settingsStore.fetchCluster();
  },
});
</script>
