<template>
  <div class="grid px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flow-root">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold dark:text-white">
            {{ t('settings.plugins.title') }}
          </h3>
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
                        v-for="(title, index) in headers"
                        :key="`th-${index}`"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        scope="col"
                      >
                        {{ title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                  >
                    <SettingsVeleroPluginLine
                      v-for="(plugin, index) in data"
                      :key="`plugin-${index}`"
                      :data="plugin"
                    />
                  </tbody>
                </table>
                <div
                  v-if="data?.length === 0 && !isFetching"
                  class="w-full flex flex-col items-center py-10 text-gray-400 dark:text-gray-300 dark:bg-gray-800"
                >
                  <FontAwesomeIcon
                    :icon="faInfoCircle"
                    class="!w-16 !h-16 mb-5"
                  />
                  {{ t('list.text.noEntries') }}
                </div>
                <div
                  v-if="isFetching && data?.length === 0"
                  class="w-full flex flex-col items-center py-10 text-gray-600 dark:text-gray-300 dark:bg-gray-800"
                >
                  <FontAwesomeIcon
                    :icon="faCircleNotch"
                    class="!w-16 !h-16 mb-5 animate-spin"
                  />
                  {{ t('list.text.fetchingEntries') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SettingsVeleroPluginLine from './SettingsVeleroPluginLine.vue';
import { faCircleNotch, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSettingsPlugins } from '@velero-ui-app/composables/settings/useSettingsPlugins';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { data, isFetching } = useSettingsPlugins();

const headers = ['Name', 'Type', 'Actions'];
</script>
