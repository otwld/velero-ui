<template>
  <div
    class="p-4 bg-white block sm:flex flex-col border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="w-full mb-1 sm:flex">
      <div
        class="items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700"
      >
        <div
          v-if="router.currentRoute.value.name !== Pages.SCHEDULE.name"
          class="lg:pr-3 inline-flex items-center space-x-2"
        >
          <SearchName />
          <button
            :class="{
              hidden: disabledFilters,
              'cursor-not-allowed': disabledFilters,
            }"
            :disabled="disabledFilters"
            class="relative inline-flex items-center transition duration-200 justify-center w-1/2 px-3 py-2.5 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            type="button"
            @click="toggleFiltersDropdown()"
          >
            <div class="relative">
              <FontAwesomeIcon
                :icon="faFilter"
                class="relative !w-4 !h-4 mr-2"
              />
            </div>
            {{ t('global.button.filters.title') }}
            <span
              v-if="Object.keys(filters)?.length > 0"
              class="absolute inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
            >
              {{ Object.keys(filters)?.length }}
            </span>
          </button>
        </div>
        <div class="flex mt-3 space-x-1 sm:pl-2 sm:mt-0">
          <slot name="bulk-buttons" />
        </div>
      </div>
      <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
        <slot name="buttons" />
        <button
          :class="{ 'cursor-not-allowed': isFetching }"
          :disabled="isFetching"
          class="inline-flex items-center transition duration-200 justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          type="button"
          @click="refetch()"
        >
          <FontAwesomeIcon
            :class="{
              'animate-spin': isFetching,
            }"
            :icon="faArrowsRotate"
            class="!w-4 !h-4 mr-2"
          />
          {{ t('global.button.refresh.title') }}
        </button>
      </div>
    </div>
    <div v-if="!hiddenFiltersDropdown" class="w-full mt-2 sm:flex gap-2">
      <slot name="filters" />

      <button
        :class="{
          'cursor-not-allowed':
            isFetching || Object.keys(filters)?.length === 0,
        }"
        :disabled="isFetching || Object.keys(filters)?.length === 0"
        class="inline-flex self-end items-center transition duration-200 justify-center px-4 py-2.5 text-sm font-medium text-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        type="button"
        @click="reset()"
      >
        {{ t('global.button.reset.title') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowsRotate, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useListStore } from '../../stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { type Router, useRouter } from 'vue-router';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { useFilters } from '@velero-ui-app/composables/search/useFilters';
import SearchName from '@velero-ui-app/components/Search/SearchName.vue';

const router: Router = useRouter();
const { t } = useI18n();
const listStore = useListStore();
const { objectType, filters, availableFilters } = storeToRefs(listStore);
const { reset } = useFilters();
const { refetch, isFetching } = useKubernetesWatchListObject(objectType.value);

const hiddenFiltersDropdown = ref(true);

const toggleFiltersDropdown = () =>
  (hiddenFiltersDropdown.value = !hiddenFiltersDropdown.value);

onBeforeUnmount(() => listStore.reset());

const disabledFilters = computed(() => {
  for (const filter of Object.keys(availableFilters.value)) {
    if (availableFilters.value[filter]?.length > 0) {
      return false;
    }
  }
  return true;
});
</script>
