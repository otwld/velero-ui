<template>
  <div class="col-span-full mb-2 xl:col-auto">
    <div
      class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
    >
      <div class="flex-col w-full">
        <div>
          <span
            class="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
            >{{ t('dashboard.stats.title.successRate') }}</span
          >
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.backups.description') }}
          </h3>
        </div>
        <div class="flex mt-4 w-full self-center items-center justify-center">
          <apexchart
            v-if="data"
            :options="{
              labels: [t('dashboard.stats.label.success')],
              noData: { text: t('global.noData') },
              chart: {
                events: {},
              },
              colors: ['#28A745'],
            }"
            :series="data.series"
            type="donut"
            width="500"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStatsBackupsSuccessRate } from '@velero-ui-app/composables/stats/useStatsBackupsSuccessRate';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { data } = useStatsBackupsSuccessRate();
</script>
