<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-2 xl:gap-4">
    <div class="col-span-full xl:col-auto">
      <div
        class="p-4 mb-4 flex bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
      >
        <div class="flex-col w-full">
          <div class="flex justify-between items-center">
            <div>
              <span
                class="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
                >Backups Status</span
              >
              <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
                Over all backups
              </h3>
            </div>
            <div>
              <router-link
                :to="Pages.BACKUPS.name"
                href="#"
                class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-blue-700 sm:text-sm hover:bg-gray-100 dark:text-blue-500 dark:hover:bg-gray-700"
              >
                See all backups
                <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 ml-2" />
              </router-link>
            </div>
          </div>
          <div class="flex mt-4 w-full self-center items-center justify-center">
            <apexchart
              v-if="data"
              width="500"
              type="donut"
              :options="data"
              :series="data.series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-full xl:col-auto">
      <div
        class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
      >
        <div class="flex-col w-full">
          <div class="flex justify-between items-center">
            <div>
              <span
                class="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
                >Backups Success Rate</span
              >
              <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
                Over all backups
              </h3>
            </div>
            <div>
              <router-link
                :to="Pages.BACKUPS.name"
                href="#"
                class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-blue-700 sm:text-sm hover:bg-gray-100 dark:text-blue-500 dark:hover:bg-gray-700"
              >
                See all backups
                <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 ml-2" />
              </router-link>
            </div>
          </div>
          <div class="flex mt-4 w-full self-center items-center justify-center">
            <apexchart
              v-if="data"
              width="500"
              type="radialBar"
              :options="{ ...dataSuccess, labels: ['Success'] }"
              :series="dataSuccess.series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStatsBackupsStatusGet } from '@velero-ui-app/use/stats/useStatsBackupsStatusGet';
import { onBeforeMount } from 'vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useStatsBackupsSuccessRateGet } from '@velero-ui-app/use/stats/useStatsBackupsSuccessRateGet';

const { get, isLoading, data } = useStatsBackupsStatusGet();

const { get: getSuccess, data: dataSuccess } = useStatsBackupsSuccessRateGet();

onBeforeMount(() => get());
onBeforeMount(() => getSuccess());
</script>
