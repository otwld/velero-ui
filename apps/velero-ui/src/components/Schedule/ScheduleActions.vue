<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon :icon="faClock" class="w-16 h-16 mr-2 dark:text-white" />

      <div>
        <h3
          v-if="schedule"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ schedule?.metadata?.name }}
        </h3>
        <div
          v-if="!schedule"
          class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div
          v-if="schedule"
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ schedule?.metadata?.uid }}
        </div>
        <div
          v-if="!schedule"
          class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div v-if="schedule" class="flex items-center space-x-4">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          >
            <FontAwesomeIcon :icon="faPen" class="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            v-if="
              schedule?.status?.phase !== V1SchedulePhase.FailedValidation &&
              schedule?.spec?.paused
            "
            type="button"
            :disabled="togglePauseLoading"
            @click="togglePause(false)"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <FontAwesomeIcon
              v-if="!togglePauseLoading"
              :icon="faPlay"
              class="w-4 h-4 mr-2"
            />
            <FontAwesomeIcon
              v-if="togglePauseLoading"
              :icon="faCircleNotch"
              class="w-4 h-4 animate-spin mr-2"
            />
            Enable
          </button>
          <button
            v-if="
              schedule?.status?.phase !== V1SchedulePhase.FailedValidation &&
              !schedule?.spec?.paused
            "
            type="button"
            :disabled="togglePauseLoading"
            @click="togglePause(true)"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FontAwesomeIcon
              v-if="!togglePauseLoading"
              :icon="faPause"
              class="w-4 h-4 mr-2"
            />
            <FontAwesomeIcon
              v-if="togglePauseLoading"
              :icon="faCircleNotch"
              class="w-4 h-4 animate-spin mr-2"
            />
            Pause
          </button>
          <button
            type="button"
            @click="this.$parent.remove()"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
          >
            <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { V1Schedule } from '@velero-ui/velero';
import {
  faPause,
  faPlay,
  faTrashCan,
  faClock,
  faPen,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { V1SchedulePhase } from '@velero-ui/velero';
import { ref, toRef } from 'vue';
import { useSchedulePause } from '@velero-ui-app/use/schedule/useSchedulePause';

const props = defineProps({
  schedule: Object as PropType<V1Schedule>,
});

const { togglePause, togglePauseLoading } = useSchedulePause(
  toRef(() => props.schedule?.metadata?.name)
);

const deleteLoading = ref(false);
</script>
