<template>
  <div class="col-span-2">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">
          {{ t('settings.agents.title') }}
        </h3>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-if="!data || data?.length === 0" class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <svg
                  class="w-6 h-6 dark:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.5 7.5h-9v9h9v-9Z" />
                  <path
                    clip-rule="evenodd"
                    d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
                ></div>
                <div
                  class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-72 mb-2"
                ></div>
                <div
                  class="h-1.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24 mb-2"
                ></div>
              </div>
              <div class="inline-flex items-center">
                <p
                  class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-32 mb-4"
                ></p>
              </div>
            </div>
          </li>
          <li
            v-for="(agent, index) of data"
            :key="`agent-${index}`"
            class="py-4"
          >
            <SettingsVeleroAgentLine :data="agent"></SettingsVeleroAgentLine>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsAgents } from '@velero-ui-app/composables/settings/useSettingsAgents';
import SettingsVeleroAgentLine from '@velero-ui-app/components/Settings/SettingsVeleroAgentLine.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { data } = useSettingsAgents();
</script>
