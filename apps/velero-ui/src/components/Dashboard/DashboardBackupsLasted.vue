<template>
  <div class="col-span-full mb-2 xl:col-auto">
    <div
      class="p-4 mb-4 flex bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-full"
    >
      <div class="flex-col w-full">
        <div>
          <h1
            class="flex text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
          >
            {{t('dashboard.stats.lasted.title')}}
          </h1>
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.lasted.description')}}
          </h3>
        </div>
        <div class="flex mt-4 flex-col h-[200px] overflow-y-auto">
          <ul v-if="isFetching && data.length === 0">
            <li
              v-for="(i, index) of 8"
              :key="`line-${index}`"
              class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-72 mb-4"
            />
          </ul>
          <ul
            v-for="(backup, index) of data"
            v-else
            :key="`line-${index}`"
            class="w-full text-gray-500 flex justify-between dark:text-gray-400"
          >
            <dt>
              <li class="list-disc list-inside">
                <router-link
                  :to="{
                    name: Pages.BACKUP.name,
                    params: {
                      name: backup.name,
                    },
                  }"
                  class="hover:text-blue-500"
                  router-link
                  >{{ truncate(backup.name, 32) }}
                </router-link>
              </li>
            </dt>
            <dd class="italic">
              {{ t('global.date.in', { count: getSinceTime(backup.date) }) }}
            </dd>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { getSinceTime } from '@velero-ui-app/utils/date.utils';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { useStatsBackupsLasted } from '@velero-ui-app/composables/stats/useStatsBackupsLasted';
import { truncate } from '../../utils/string.utils';

const { t } = useI18n();
const { isFetching, data } = useStatsBackupsLasted();
</script>
