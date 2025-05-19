<template>
  <div class="col-span-full mb-2 xl:col-auto">
    <div
      class="p-4 mb-4 flex bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
    >
      <div class="flex-col w-full">
        <div>
          <div
            class="flex text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
          >
             <div
              v-if="isFetching && data.length === 0"
              class="h-6 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-8 mr-2"
            />
            <span v-else class="mr-2">
              {{ data.length }}
            </span>
            {{t('dashboard.stats.unscheduled.title')}}</div
          >
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{t('dashboard.stats.unscheduled.description')}}
          </h3>
        </div>
        <ul class="flex mt-4 flex-col h-[200px] overflow-y-auto">
          <li v-if="isFetching && data.length === 0">
            <div
              v-for="(i, index) of 8"
              :key="`line-${index}`"
              class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-72 mb-4"
            />
          </li>
          <li
            v-for="(namespace, index) of data"
            v-else
            :key="`line-${index}`"
            class="max-w-md text-gray-500 list-disc list-inside dark:text-gray-400"
          >
            {{ namespace }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useStatsUnscheduledNamespaces } from '@velero-ui-app/composables/stats/useStatsUnscheduledNamespaces';

const { t } = useI18n();
const { isFetching, data } = useStatsUnscheduledNamespaces();
</script>
