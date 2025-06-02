<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden shadow">
          <table
            class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600"
          >
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="p-4" scope="col">
                  <div class="flex items-center">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        id="checkbox-all"
                        :checked="checked === 'true' || checked === 'partial'"
                        aria-describedby="checkbox-1"
                        class="peer w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        type="checkbox"
                        @click="globalCheck($event)"
                      />

                      <span
                        v-if="checked === 'partial'"
                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <FontAwesomeIcon :icon="faSquare" class="!w-3 !h-3" />
                      </span>
                    </label>
                  </div>
                </th>
                <th
                  v-for="(header, index) in headers"
                  :key="`th-${index}`"
                  class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                  scope="col"
                >
                  <button
                    v-if="header.sort"
                    :class="{ 'font-bold': header.sort.selected }"
                    class="flex items-center uppercase"
                    type="button"
                    @click="listStore.applyHeaderSort(header.sort)"
                  >
                    {{ t(header.name) }}
                    <template v-if="header.sort.selected">
                      <FontAwesomeIcon
                        v-if="
                          header.sort.direction === SortDirection.Descending
                        "
                        :icon="faSortDown"
                        class="!w-4 !h-4 pb-2 pl-2"
                      />
                      <FontAwesomeIcon
                        v-else
                        :icon="faSortUp"
                        class="!w-4 !h-4 pt-2 pl-2"
                      />
                    </template>
                  </button>
                  <span v-else>{{ t(header.name) }}</span>
                </th>
              </tr>
            </thead>
            <tbody
              :class="{
                'animate-pulse-loading': isFetching && data?.length > 0,
                'cursor-progress': isFetching && data?.length > 0,
              }"
              class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
            >
              <ListContentLine
                v-for="(item, index) in data"
                :key="`list-item-${index}`"
                :name="item?.metadata?.name"
              >
                <template #content>
                  <component
                    :is="component"
                    :data="item"
                  />
                </template>
              </ListContentLine>
            </tbody>
          </table>
          <div
            v-if="data?.length === 0 && !isFetching"
            class="w-full flex flex-col items-center py-10 text-gray-400 dark:text-gray-300 dark:bg-gray-800"
          >
            <FontAwesomeIcon :icon="faInfoCircle" class="!w-16 !h-16 mb-5" />
            {{ t('list.text.noEntries') }}
          </div>
          <div
            v-if="isFetching && data?.length === 0"
            class="w-full flex flex-col items-center py-10 text-gray-600 dark:text-gray-300 dark:bg-gray-800"
          >
            <FontAwesomeIcon
              :icon="faCircleNotch"
              class="!w-16 !h-16 mb-5 animate-spin"
            />
            {{ t('list.text.fetchingEntries') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
  faInfoCircle,
  faSortDown,
  faSortUp,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { SortDirection } from '@velero-ui/shared-types';
import ListContentLine from '@velero-ui-app/components/List/ListContentLine.vue';

const { t } = useI18n();
const listStore = useListStore();
const { headers, objectType, checkedItems } = storeToRefs(listStore);

const { on, off, data, isFetching } = useKubernetesWatchListObject(
  objectType.value
);

defineProps({
  component: { type: Object, required: true },
});

onBeforeMount(() => on());
onBeforeUnmount(() => off());

const globalCheck = ($event) => {
  if (checked.value === 'true') {
    listStore.resetCheckedItems();
  } else {
    data.value.forEach((e, index) => checkedItems.value.add(e?.metadata?.name));
  }
  $event.preventDefault();
  $event.stopPropagation();
};

const checked = computed(() => {
  if (checkedItems.value.size === 0) {
    return 'false';
  } else if (checkedItems.value.size < data.value.length) {
    return 'partial';
  }
  return 'true';
});
</script>
