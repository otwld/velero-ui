<template>
  <div
    class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center justify-between flex-wrap gap-x-4">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.stats') }}
      </h3>
      <div v-if="!isFetching" class="inline-flex rounded-md shadow-xs">
        <button
          :class="{
            'text-blue-700': currentTab === 'duration',
            'cursor-not-allowed': currentTab === 'duration',
          }"
          :disabled="currentTab === 'duration'"
          aria-current="page"
          class="inline-flex items-center px-4 py-1 text-sm font-medium bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          type="button"
          @click="currentTab = 'duration'"
        >
          <FontAwesomeIcon :icon="faStopwatch" class="!w-4 !h-4 mr-1.5" />
          {{ t('global.button.duration.title') }}
        </button>
        <button
          :class="{
            'text-blue-700': currentTab === 'items',
            'cursor-not-allowed': currentTab === 'items',
          }"
          :disabled="currentTab === 'items'"
          class="inline-flex items-center px-4 py-1 text-sm font-medium bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          type="button"
          @click="currentTab = 'items'"
        >
          <FontAwesomeIcon :icon="faRectangleList" class="!w-4 !h-4 mr-1.5" />
          {{ t('global.button.items.title') }}
        </button>
        <button
          :class="{
            'text-blue-700': currentTab === 'size',
            'cursor-not-allowed': currentTab === 'size',
          }"
          :disabled="currentTab === 'size'"
          class="inline-flex items-center px-4 py-1 text-sm font-medium bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          type="button"
          @click="currentTab = 'size'"
        >
          <FontAwesomeIcon :icon="faSquareBinary" class="!w-4 !h-4 mr-1.5" />
          {{ t('global.button.size.title') }}
        </button>
      </div>
      <div
        class="mt-4 h-[300px] w-full self-center items-center justify-center"
      >
        <apexchart
          v-if="data[currentTab]?.series.length > 0"
          :options="{
            noData: {
              text: t('global.noData'),
            },
            stroke: {
              curve: 'smooth',
            },
            xaxis: {
              type: 'category',
            },
            yaxis: {
              type: 'numeric',
              labels: {
                formatter: getFormatter,
              },
            },
          }"
          :series="data[currentTab]?.series"
          height="100%"
          type="line"
          width="100%"
        />
        <div v-else class="flex h-full items-center justify-center">
          <span v-if="!isFetching" class="text-gray-500 dark:text-gray-400">
            {{ t('global.noData') }}
          </span>
          <span v-else class="text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon
              :icon="faCircleNotch"
              class="!w-4 !h-4 animate-spin mr-2"
            />
            {{ t('dashboard.stats.title.loading') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScheduleStats } from '@velero-ui-app/composables/schedule/useScheduleStats';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
  faRectangleList,
  faSquareBinary,
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { durationToLabel } from '@velero-ui-app/utils/date.utils';
import { convertBytes } from '@velero-ui-app/utils/string.utils';

const { t } = useI18n();
const props = defineProps({
  name: { type: String, required: true },
});

const { data, isFetching } = useScheduleStats(props.name);

const currentTab = ref('duration');

const getFormatter = (value: number): string | number => {
  switch (currentTab.value) {
    case 'duration':
      return durationToLabel(value);
    case 'size':
      return convertBytes(value);
    default:
      return value;
  }
};
</script>
