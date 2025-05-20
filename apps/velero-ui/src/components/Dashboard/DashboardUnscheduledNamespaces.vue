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
            <Skeleton
              v-if="isFetching && data.length === 0"
              class="mr-2"
              height="6"
              width="8"
            />
            <span v-else class="mr-2">
              {{ data.length }}
            </span>
            {{ t('dashboard.stats.unscheduled.title') }}
          </div>
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.unscheduled.description') }}
          </h3>
        </div>
        <ul class="flex mt-4 flex-col h-[200px] overflow-y-auto">
          <li v-if="isFetching && data.length === 0">
            <Skeleton
              v-for="(i, index) of 8"
              :key="`line-${index}`"
              class="mb-4"
              width="72"
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
import Skeleton from '@velero-ui-app/components/Skeleton.vue';

const { t } = useI18n();
const { isFetching, data } = useStatsUnscheduledNamespaces();
</script>
