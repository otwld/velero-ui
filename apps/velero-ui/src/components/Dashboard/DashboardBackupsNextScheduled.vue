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
            {{ t('dashboard.stats.nextScheduled.title') }}
          </div>
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.nextScheduled.description') }}
          </h3>
        </div>
        <div class="relative overflow-y-auto mt-4 h-[250px]">
          <div
            v-if="data.length === 0 && !isFetching"
            class="flex h-full items-center justify-center"
          >
            <span class="text-gray-500 dark:text-gray-400">
              {{ t('dashboard.stats.nextScheduled.noData') }}
            </span>
          </div>
          <table v-else class="w-full">
            <tbody>
              <template v-if="isFetching && data.length === 0">
                <tr
                  v-for="(i, index) of 8"
                  :key="`skeleton--${index}`"
                  class="even:bg-white odd:dark:bg-gray-900 odd:bg-gray-50 even:dark:bg-gray-800"
                >
                  <td class="py-1 px-2">
                    <Skeleton class="m-1.5" width="4" />
                  </td>
                  <td class="py-1 px-2">
                    <Skeleton class="m-1.5" width="48" />
                  </td>
                  <td class="py-1 px-2 flex justify-end">
                    <Skeleton class="m-1.5" width="24" />
                  </td>
                </tr>
              </template>
              <tr
                v-for="(schedule, index) of data"
                v-else
                :key="`line-${index}`"
                class="even:bg-white odd:dark:bg-gray-900 odd:bg-gray-50 even:dark:bg-gray-800"
              >
                <td class="py-1 px-2 inline-flex dark:text-gray-400">
                  <FontAwesomeIcon :icon="faClock" class="!w-3 !h-3" />
                </td>
                <td class="py-1 px-2 text-gray-500 text-sm dark:text-gray-400">
                  <router-link
                    :to="{
                      name: Pages.SCHEDULE.name,
                      params: {
                        name: schedule.name,
                      },
                    }"
                    class="hover:text-blue-500 transition duration-200"
                    router-link
                    >{{ truncate(schedule.name, 32) }}
                  </router-link>
                </td>
                <td class="py-1 px-2 flex text-xs justify-end italic text-gray-500 dark:text-gray-400">
                  {{
                    t('global.date.in', {
                      count: getRemainingTime(schedule.nextRun),
                    })
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useStatsBackupsNextScheduled } from '@velero-ui-app/composables/stats/useStatsBackupsNextScheduled';
import { getRemainingTime } from '@velero-ui-app/utils/date.utils';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { truncate } from '@velero-ui-app/utils/string.utils';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import { faClock, faClockRotateLeft, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const { t } = useI18n();
const { isFetching, data } = useStatsBackupsNextScheduled();
</script>
