<template>
  <div class="col-span-2">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">Node Agents</h3>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-if="!veleroAgents || veleroAgents?.length === 0" class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 dark:text-white"
                >
                  <path d="M16.5 7.5h-9v9h9v-9Z" />
                  <path
                    fill-rule="evenodd"
                    d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
                ></div>
                <div
                  class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-72 mb-2"
                ></div>
                <div
                  class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-2"
                ></div>
              </div>
              <div class="inline-flex items-center">
                <p
                  class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"
                ></p>
              </div>
            </div>
          </li>
          <li v-for="agent of veleroAgents" class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <FontAwesomeIcon :icon="faMicrochip" class="w-6 h-6 dark:text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="flex items-center text-base font-semibold text-gray-900 truncate dark:text-white"
                >
                  {{ agent.name }}
                  <div
                    v-if="agent.connected"
                    class="h-2.5 w-2.5 rounded-full bg-green-400 ml-2"
                  ></div>
                  <div
                    v-if="!agent.connected"
                    class="h-2.5 w-2.5 rounded-full bg-red-500 ml-2"
                  ></div>
                </div>
                <p
                  class="text-sm font-normal text-gray-500 truncate dark:text-gray-400"
                >
                  {{ agent.node }}
                </p>
                <p
                  class="text-xs font-normal text-gray-500 truncate dark:text-gray-400"
                >
                  {{ agent.version }}
                </p>
              </div>
              <div class="inline-flex items-center">
                <p class="text-right dark:text-white">{{ agent.ip }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../stores/settings.store';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
  name: 'VeleroServerAgentsSettings',
  components: { FontAwesomeIcon },
  setup() {
    const settingsStore = useSettingsStore();
    const { veleroAgents } = storeToRefs(settingsStore);

    return { settingsStore, veleroAgents };
  },
  data: () => ({
    faMicrochip,
  }),
  beforeMount() {
    this.settingsStore.fetchVeleroAgents();
  },
});
</script>
