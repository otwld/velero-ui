<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          id="checkbox-"
          aria-describedby="checkbox-1"
          type="checkbox"
          class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="checkbox-" class="sr-only">checkbox</label>
      </div>
    </td>
    <router-link
      router-link
      :to="{
        name: Pages.SCHEDULE.name,
        params: {
          name: data.metadata.name,
        },
      }"
    >
      <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ data.metadata.name }}
          </div>
          <div class="text-xs font-normal text-gray-500 dark:text-gray-400">
            {{ data.metadata.uid }}
          </div>
        </div>
      </td>
    </router-link>
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      <router-link
        v-if="data.spec.template?.storageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: data.spec.template.storageLocation,
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faServer" class="w-3 h-3 mr-1.5" />
        {{ data.spec.template.storageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.spec.schedule }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data.status.lastBackup) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center flex-col">
        <ScheduleStatusPhaseBadge
          :status="data.status.phase"
          :paused="data.status.paused"
        ></ScheduleStatusPhaseBadge>
        <span
          v-if="data?.spec?.paused"
          class="mt-2 bg-yellow-100 text-yellow-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
        >
          Paused
        </span>
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          v-if="
            data?.status?.phase !== V1SchedulePhase.FailedValidation &&
            data?.spec?.paused
          "
          type="button"
          :disabled="togglePauseLoading"
          @click="togglePause(false)"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-l-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900"
        >
          <FontAwesomeIcon
            v-if="!togglePauseLoading"
            :icon="faPlay"
            class="w-4 h-4"
          />
          <FontAwesomeIcon
            v-if="togglePauseLoading"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
        </button>
        <button
          v-if="
            data?.status?.phase !== V1SchedulePhase.FailedValidation &&
            !data?.spec?.paused
          "
          type="button"
          :disabled="togglePauseLoading"
          @click="togglePause(true)"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-l-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          <FontAwesomeIcon
            v-if="!togglePauseLoading"
            :icon="faPause"
            class="w-4 h-4"
          />
          <FontAwesomeIcon
            v-if="togglePauseLoading"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
        </button>

        <button
          type="button"
          @click="remove()"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-r-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
        >
          <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import type { V1Schedule } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import type { PropType } from 'vue';
import { useScheduleStore } from '../../stores/schedule.store';
import {
  faPause,
  faPlay,
  faTrashCan,
  faServer,
  faArrowUpRightFromSquare,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '../../utils/constants.utils';
import ScheduleStatusPhaseBadge from './ScheduleStatusPhaseBadge.vue';
import { V1SchedulePhase } from '@velero-ui/velero';
import { toRef } from 'vue';
import { useSchedulePause } from '@velero-ui-app/use/schedule/useSchedulePause';
import { useScheduleRemove } from '@velero-ui-app/use/schedule/useScheduleRemove';

const props = defineProps({
  data: Object as PropType<V1Schedule>,
});

const { togglePause, togglePauseLoading } = useSchedulePause(
  toRef(() => props.data?.metadata?.name)
);

const { remove, removeLoading } = useScheduleRemove(
  toRef(() => props.data?.metadata?.name)
);
</script>
