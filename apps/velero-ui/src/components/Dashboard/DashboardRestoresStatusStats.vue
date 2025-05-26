<template>
  <div class="col-span-full mb-2 xl:col-auto">
    <div
      class="p-4 mb-4 flex bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
    >
      <div class="flex-col w-full">
        <div>
          <span
            class="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
            >{{ t('dashboard.stats.title.status') }}</span
          >
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.restores.description') }}
          </h3>
        </div>
        <div
          class="mt-4 w-full xl:h-[500px] h-[300px] self-center items-center justify-center"
        >
          <apexchart
            v-if="data.series.length > 0"
            :options="{
              ...data,
              labels: labels,
              noData: {
                text: t('global.noData'),
              },
              legend: {
                position: 'bottom',
              },
            }"
            :series="data.series"
            height="100%"
            type="donut"
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
  </div>
</template>

<script lang="ts" setup>
import { useStatsRestoresStatus } from '@velero-ui-app/composables/stats/useStatsRestoresStatus';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { t } = useI18n();
const { data, isFetching } = useStatsRestoresStatus();

const labels = computed(() =>
  data.value.labels.map((l) => t(`resource.phase.${l}`))
);
</script>
