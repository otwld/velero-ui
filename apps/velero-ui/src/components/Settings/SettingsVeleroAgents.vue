<template>
  <div class="col-span-2">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
      <div class="flow-root">
        <div class="flex items-center">
          <h3 class="text-xl font-semibold dark:text-white">
            {{ t('settings.agents.title') }}
          </h3>
          <Skeleton v-if="data && data.length === 0" class="ml-4" width="12" />
          <Badge
            v-if="data && data.length >= 0"
            :prefix-icon="faMicrochip"
            :text="data.length.toString()"
            class="ml-4"
            color="blue"
          />
        </div>
        <ul
          class="divide-y divide-gray-200 dark:divide-gray-700 overflow-auto max-h-[250px] mt-2 pr-2"
        >
          <template v-if="!data || data?.length === 0">
            <li v-for="index of 2" :key="index" class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <FontAwesomeIcon
                    :icon="faMicrochip"
                    class="!w-6 !h-6 dark:text-white"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <Skeleton class="mb-4" height="2.5" width="48" />
                  <Skeleton class="mb-2" width="72" />
                  <Skeleton class="mb-2" height="1.5" width="24" />
                </div>
                <div class="inline-flex items-center">
                  <Skeleton class="mb-4" width="32" />
                </div>
              </div>
            </li>
          </template>
          <li
            v-for="(agent, index) of data"
            :key="`agent-${index}`"
            class="py-4"
          >
            <SettingsVeleroAgentLine :data="agent" />
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
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import Badge from '@velero-ui-app/components/Badge.vue';

const { t } = useI18n();
const { data } = useSettingsAgents();
</script>
