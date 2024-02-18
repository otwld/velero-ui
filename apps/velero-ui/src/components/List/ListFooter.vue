<template>
  <div
    class="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex items-center mb-4 sm:mb-0 divide-x divide-gray-200">
      <span class="text-sm font-normal text-gray-500 dark:text-gray-400"
        >Showing
        <span class="font-semibold text-gray-900 dark:text-white"
          >{{ offset }}-{{
            offset + limit > total ? total : offset + limit
          }}</span
        >
        of
        <span class="font-semibold text-gray-900 dark:text-white">{{
          total
        }}</span></span
      >
      <div
        class="ml-3 pl-3 text-sm font-normal text-gray-500 dark:text-gray-400"
      >
        <div class="max-w-sm mx-auto inline-flex items-center">
          <label for="underline_select" class="pr-1">Entries per page:</label>
          <select
            v-model="limit"
            @change="
              listStore.setLimit(parseInt($event.target.value));
              emit('onRefresh');
            "
            id="underline_select"
            class="text-xs text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        :disabled="loading"
        :class="{ 'cursor-not-allowed': loading }"
        @click="
          listStore.previous();
          emit('onRefresh');
        "
        class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center rounded-l-lg text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        <FontAwesomeIcon :icon="faChevronLeft" class="w-3 h-3 mr-1" />
        Previous
      </button>
      <button
        type="button"
        :disabled="loading"
        :class="{ 'cursor-not-allowed': loading }"
        @click="
          listStore.next();
          emit('onRefresh');
        "
        class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center rounded-r-lg text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        Next
        <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 ml-1" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useListStore } from '../../stores/list.store';
import { storeToRefs } from 'pinia';

const listStore = useListStore();
const { offset, limit, total } = storeToRefs(listStore);

const emit = defineEmits(['onRefresh']);

defineProps({
  loading: Boolean,
});
</script>
