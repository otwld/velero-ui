<template>
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
    <router-link router-link :to="'/schedules/' + data.metadata.uid">
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
      {{ data.spec.template.storageLocation }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.spec.schedule }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.spec.template.ttl }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="
            data.status.phase === ScheduleStatusPhase.ENABLED && !data.spec.paused
          "
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        ></div>
        <div
          v-if="data.status.phase === ScheduleStatusPhase.NEW"
          class="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"
        ></div>
        <div
          v-if="data.status.phase === ScheduleStatusPhase.FAILED_VALIDATION"
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        ></div>
        <div
          v-if="data.spec.paused"
          class="h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"
        ></div>
        {{ data.spec.paused ? 'Paused' : data.status.phase }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        type="button"
        @click="switchStatus()"
        data-modal-target="delete-user-modal"
        data-modal-toggle="delete-user-modal"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
      >
        <svg
          v-if="data.status.phase !== ScheduleStatusPhase.FAILED_VALIDATION && !data.spec.paused"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z"
          />
        </svg>
        <svg
          v-if="data.status.phase !== ScheduleStatusPhase.FAILED_VALIDATION && data.spec.paused"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z"
          />
        </svg>
      </button>
      <button
        type="button"
        @click="remove()"
        data-modal-target="delete-user-modal"
        data-modal-toggle="delete-user-modal"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        <svg
          class="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Schedule } from '@velero-ui/shared-types';
import { convertTimestampToDate, getRemainingTime } from '../../utils/date.utils';
import type { PropType } from 'vue';
import { useScheduleStore } from '../../stores/schedule.store';
import { ScheduleStatusPhase } from '@velero-ui/shared-types';

export default defineComponent({
  name: 'ScheduleLine',
  computed: {
    ScheduleStatusPhase() {
      return ScheduleStatusPhase;
    },
  },
  setup() {
    const scheduleStore = useScheduleStore();
    return { scheduleStore };
  },
  props: {
    data: Object as PropType<Schedule>,
  },
  methods: {
    getRemainingTime,
    convertTimestampToDate,
    switchStatus(): void {
      console.log('click switch');
    },
    remove(): void {
      console.log('click remove');
    },
  },
});
</script>
