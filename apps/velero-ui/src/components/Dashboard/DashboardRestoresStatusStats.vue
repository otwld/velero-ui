<template>
  <div class="col-span-full xl:col-auto">
    <div
      class="p-4 mb-4 flex bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
    >
      <div class="flex-col w-full">
        <div>
          <span
            class="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
            >Status</span
          >
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            Over all restores
          </h3>
        </div>
        <div class="flex mt-4 w-full self-center items-center justify-center">
          <apexchart
            v-if="data"
            width="500"
            type="donut"
            :options="{ ...data, noData: { text: 'No Data' } }"
            :series="data.series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useStatsRestoresStatusGet } from '@velero-ui-app/use/stats/useStatsRestoresStatusGet';

const { get, data } = useStatsRestoresStatusGet();
onBeforeMount(() => get());
</script>
