<template>
  <div class="grid px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flow-root">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold dark:text-white">Plugins</h3>
          <button
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden shadow">
                <table
                  class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600"
                >
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th
                        v-for="title in headers"
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        {{ title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                  >
                    <SettingsVeleroPluginLine
                      v-for="plugin in plugins"
                      :data="plugin"
                    ></SettingsVeleroPluginLine>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../stores/settings.store';
import SettingsVeleroPluginLine from './SettingsVeleroPluginLine.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onBeforeMount } from 'vue';

const settingsStore = useSettingsStore();
const { plugins } = storeToRefs(settingsStore);

const headers = ['Name', 'Type', 'Actions'];

onBeforeMount(() => settingsStore.fetchVeleroPlugins());
</script>
