<template>
  <div
    class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="w-full mb-1">
      <div class="sm:flex">
        <div
          class="items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700"
        >
          <div v-if="router.currentRoute.value.name !== Pages.SCHEDULE.name" class="lg:pr-3">
            <label class="sr-only" for="backups-search">{{
              t('list.search.label')
            }}</label>
            <div class="relative mt-1 lg:w-64 xl:w-96">
              <FormKit
                id="search"
                :name="t('list.search.name')"
                :placeholder="t('list.search.placeholder')"
                :validation="[['k8s_name']]"
                type="text"
                value=""
                @keyup="handleNameSearch()"
                @keyup.enter="applyNameSearch()"
              >
                <template #suffixIcon>
                  <FontAwesomeIcon
                    v-if="isFetching"
                    :icon="faCircleNotch"
                    class="absolute right-[10px] top-[14px] !w-4 !h-4 animate-spin text-gray-400"
                  />
                  <button class="absolute right-[10px] top-[10px] transition duration-200 cursor-pointer dark:text-white" type="button">
                    <FontAwesomeIcon
                      v-if="searchContext.value && !isFetching"
                      :icon="faXmark"
                      class="!w-4 !h-4"
                      @click="resetNameSearch()"
                    />
                  </button>
                </template>
              </FormKit>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowsRotate,
  faCircleNotch,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useListStore } from '../../stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { type Router, useRouter } from 'vue-router';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { useFormKitContextById } from '@formkit/vue';

const router: Router = useRouter();

const { t } = useI18n();
const listStore = useListStore();
const { objectType } = storeToRefs(listStore);

const { refetch, isFetching } = useKubernetesWatchListObject(objectType.value);

const searchContext = useFormKitContextById('search');

let timeout: NodeJS.Timeout;

const applyNameSearch = () => {
  if (searchContext.value.state.complete) {
    listStore.applyNameFilter(searchContext.value.value);
    listStore.setOffset(0);
  }
};

const handleNameSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    applyNameSearch();
  }, 1500);
};

const resetNameSearch = () => {
  searchContext.value.node.input('');
  searchContext.value.value = '';
  applyNameSearch();
};

onBeforeUnmount(() => clearTimeout(timeout));
onBeforeUnmount(() => listStore.reset());
</script>
