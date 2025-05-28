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
            {{ t('dashboard.stats.latest.title') }}
          </h1>
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.latest.description') }}
          </h3>
        </div>
        <div class="relative overflow-y-auto mt-4 h-[250px]">
          <div
            v-if="data.length === 0 && !isFetching"
            class="flex h-full items-center justify-center"
          >
            <span class="text-gray-500 dark:text-gray-400">
              {{ t('dashboard.stats.latest.noData') }}
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
                v-for="(backup, index) of data"
                v-else
                :key="`line-${index}`"
                class="even:bg-white odd:dark:bg-gray-900 odd:bg-gray-50 even:dark:bg-gray-800"
              >
                <td class="py-1 px-2 inline-flex ">
                  <FontAwesomeIcon v-if="backup.phase === V1BackupPhase.Completed" :icon="faCheckCircle" class="!w-3 !h-3 text-green-500" />
                  <FontAwesomeIcon v-else-if="backup.phase === V1BackupPhase.Failed || backup.phase === V1BackupPhase.FailedValidation" :icon="faCircleExclamation" class="!w-3 !h-3 text-red-500" />
                  <FontAwesomeIcon v-else-if="backup.phase === V1BackupPhase.PartiallyFailed" :icon="faTriangleExclamation" class="!w-3 !h-3 text-orange-500" />
                  <FontAwesomeIcon v-else-if="backup.phase === V1BackupPhase.Deleting" :icon="faCircleNotch" class="!w-3 !h-3 text-red-500 animate-spin" />
                  <FontAwesomeIcon v-else :icon="faCircleNotch" class="!w-3 !h-3 text-blue-500 animate-spin" />
                </td>
                <td class="py-1 px-2 text-gray-500 text-sm dark:text-gray-400">
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
                </td>
                <td
                  class="py-1 px-2 flex text-xs justify-end italic text-gray-500 dark:text-gray-400"
                >
                  {{
                    t('global.date.ago', { count: getSinceTime(backup.date) })
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
import { getSinceTime } from '@velero-ui-app/utils/date.utils';
import { useStatsBackupsLatest } from '@velero-ui-app/composables/stats/useStatsBackupsLatest';
import { truncate } from '../../utils/string.utils';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCheckCircle,
  faCircleExclamation,
  faCircleNotch,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { V1BackupPhase } from "@velero-ui/velero";

const { t } = useI18n();
const { isFetching, data } = useStatsBackupsLatest();
</script>
