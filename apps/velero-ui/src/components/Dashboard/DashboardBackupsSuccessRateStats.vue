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
        <div
          class="mt-4 w-full xl:h-[500px] h-[300px] self-center items-center justify-center"
        >
          <apexchart
            v-if="data.series.length > 0"
            :options="{
              labels: [t('dashboard.stats.label.success')],
              noData: {
                text: t('global.noData'),
              },
              colors: ['#28A745'],
            }"
            :series="data.series"
            height="100%"
            type="radialBar"
            width="100%"
          />
          <div
            v-else
            class="flex h-full items-center justify-center"
          >
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
  </div>
</template>
<script lang="ts" setup>
import { useStatsBackupsSuccessRate } from '@velero-ui-app/composables/stats/useStatsBackupsSuccessRate';
import { useI18n } from 'vue-i18n';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { t } = useI18n();
const { data, isFetching } = useStatsBackupsSuccessRate();
</script>
