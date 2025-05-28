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
              {{ data[0] === '*' ? 0 : data.length }}
            </span>
            {{ t('dashboard.stats.unscheduled.title') }}
          </div>
          <h3 class="text-base font-light text-gray-500 dark:text-gray-400">
            {{ t('dashboard.stats.unscheduled.description') }}
          </h3>
        </div>
        <div class="relative overflow-y-auto mt-4 h-[250px]">
          <div
            v-if="data[0] === '*' && !isFetching"
            class="flex h-full items-center justify-center"
          >
            <span class="inline-flex items-center text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon
                :icon="faCheckCircle"
                class="!w-3 !h-3 text-green-500 mr-2"
              />
              {{ t('dashboard.stats.unscheduled.success') }}
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
                v-for="(namespace, index) of data"
                v-else
                :key="`line-${index}`"
                class="even:bg-white odd:dark:bg-gray-900 odd:bg-gray-50 even:dark:bg-gray-800"
              >
                <td class="py-1 px-2 inline-flex dark:text-gray-400">
                  <FontAwesomeIcon :icon="faLayerGroup" class="!w-3 !h-3" />
                </td>
                <td class="py-1 px-2 text-gray-500 text-sm dark:text-gray-400">
                  {{ namespace }}
                </td>
                <td class="py-1 px-2 flex justify-end">
                  <button
                    v-if="can(Action.Create, Resources.SCHEDULE.plural)"
                    class="inline-flex items-center px-1.5 py-1 text-xs transition duration-200 font-medium text-center text-white bg-blue-700 hover:bg-blue-800 rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                    @click="createSchedule(namespace)"
                  >
                    <FontAwesomeIcon :icon="faPlus" class="!w-3 !h-3 mr-1" />
                    {{ t('resource.spec.schedule') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <VModal
    v-if="showModalAdd"
    id="modal-add"
    width="lg:w-6/12"
    @on-close="showModalAdd = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.createNewSchedule') }}
      </h3>
    </template>
    <template #content>
      <ScheduleFormCreate @on-close="showModalAdd = false" />
    </template>
  </VModal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useStatsUnscheduledNamespaces } from '@velero-ui-app/composables/stats/useStatsUnscheduledNamespaces';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import { ref } from 'vue';
import ScheduleFormCreate from '@velero-ui-app/components/Schedule/forms/ScheduleFormCreate.vue';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import { Resources } from '@velero-ui/velero';
import {
  faCheckCircle,
  faLayerGroup,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useFormStore } from '@velero-ui-app/stores/form.store';

const { t } = useI18n();
const { isFetching, data } = useStatsUnscheduledNamespaces();
const formStore = useFormStore();

const showModalAdd = ref(false);

const createSchedule = (namespace: string) => {
  showModalAdd.value = true;
  formStore.setFormContent([
    {
      name: `schedule-${namespace}`,
    },
    {
      includedNamespaces: [namespace],
    },
  ]);
};
</script>
