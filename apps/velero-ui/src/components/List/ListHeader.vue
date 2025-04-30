<template>
  <div
    class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="w-full mb-1">
      <div class="sm:flex">
        <div
          v-if="router.currentRoute.value.name !== Pages.SCHEDULE.name"
          class="items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700"
        >
          <div class="lg:pr-3">
            <label class="sr-only" for="backups-search">{{
              t('list.search.label')
            }}</label>
            <div class="relative mt-1 lg:w-64 xl:w-96">
              <input
                id="backups-search"
                v-model="searchInput"
                :placeholder="t('list.search.placeholder')"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="backup"
                type="text"
              />
            </div>
          </div>
          <div class="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
            <slot name="bulk-buttons" />
          </div>
        </div>
        <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
          <slot name="buttons" />
          <button
            :class="{ 'cursor-not-allowed': isFetching }"
            :disabled="isFetching"
            class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onWatcherCleanup, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useListStore } from '../../stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import {type Router, useRouter} from "vue-router";
import {Pages} from "@velero-ui-app/utils/constants.utils";

const router: Router = useRouter();

const { t } = useI18n();
const listStore = useListStore();
const { objectType } = storeToRefs(listStore);

const { refetch, isFetching } = useKubernetesWatchListObject(objectType.value);

const searchInput = ref('');

let timeout: NodeJS.Timeout;

watch(searchInput, () => {
  timeout = setTimeout(() => {
    listStore.applyNameFilter(searchInput.value);
    listStore.setOffset(0);
  }, 1500);
  onWatcherCleanup(() => {
    clearTimeout(timeout);
  });
});

onBeforeUnmount(() => clearTimeout(timeout));
onBeforeUnmount(() => listStore.reset());

</script>
