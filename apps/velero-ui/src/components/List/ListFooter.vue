<template>
  <div
    class="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex items-center mb-4 sm:mb-0">
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
    </div>
    <div class="flex items-center space-x-3">
      <button
        type="button"
        @click="previous()"
        class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <FontAwesomeIcon :icon="faChevronLeft" class="w-3 h-3 mr-1" />
        Previous
      </button>
      <button
        type="button"
        @click="next()"
        class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Next
        <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 ml-1" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
  name: 'ListFooter',
  components: { FontAwesomeIcon },
  props: {
    offset: Number,
    limit: Number,
    total: Number,
  },
  data() {
    return {
      faChevronRight,
      faChevronLeft,
    };
  },
  methods: {
    next() {
      this.$parent.next();
    },
    previous() {
      this.$parent.previous();
    },
  },
});
</script>
