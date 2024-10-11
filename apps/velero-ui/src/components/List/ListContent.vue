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
                        class="peer w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 appearance-none focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        type="checkbox"
                        @click="globalCheck($event)"
                      />

                      <span
                        v-if="checked === 'partial'"
                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <FontAwesomeIcon :icon="faSquare" class="w-2.5 h-2.5" />
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
                    v-if="header.sort.enabled"
                    :class="{ 'font-bold': header.sort.selected }"
                    class="flex items-center uppercase"
                    type="button"
                    @click="listStore.applyHeaderSort(header.name)"
                  >
                    {{ header.name }}
                    <FontAwesomeIcon
                      v-if="header.sort.selected && header.sort?.ascending"
                      :icon="faSortDown"
                      class="w-4 h-4 pb-2 pl-2"
                    />
                    <FontAwesomeIcon
                      v-if="header.sort.selected && !header.sort?.ascending"
                      :icon="faSortUp"
                      class="w-4 h-4 pt-2 pl-2"
                    />
                  </button>
                  <span v-if="!header.sort.enabled">{{ header.name }}</span>
                </th>
              </tr>
            </thead>
            <tbody
              :class="{
                'animate-pulse-loading': isFetching && data?.length > 0,
                'cursor-progress': isFetching && data?.length > 0,
              }"
              class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 cur"
            >
              <component
                :is="component"
                v-for="(item, index) in data"
                :key="`list-item-${index}`"
                :checked="checkedItems[`${index}`]"
                :data="item"
                @onChecked="setCheckedItem(index)"
              />
            </tbody>
          </table>
          <div
            v-if="data?.length === 0 && !isFetching"
            class="w-full flex flex-col items-center py-10 text-gray-400 dark:text-gray-300 dark:bg-gray-800"
          >
            <FontAwesomeIcon :icon="faInfoCircle" class="w-16 h-16 mb-5" />
            There are no entries.
          </div>
          <div
            v-if="isFetching && data?.length === 0"
            class="w-full flex flex-col items-center py-10 text-gray-600 dark:text-gray-300 dark:bg-gray-800"
          >
            <FontAwesomeIcon
              :icon="faCircleNotch"
              class="w-16 h-16 mb-5 animate-spin"
            />
            Fetching entries
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
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
import { useKubernetesListObject } from '@velero-ui-app/composables/useKubernetesListObject';

const listStore = useListStore();
const { headers, objectType } = storeToRefs(listStore);

const { data, isFetching } = useKubernetesListObject(objectType.value);

defineProps({
  component: Object,
});

const checkedItems = ref({});
const checked = ref('false');

const resetCheckedItems = () =>
  Object.keys(checkedItems.value).length === 0
    ? data.value.forEach((e, index) => (checkedItems.value[`${index}`] = false))
    : null;

const globalCheck = ($event) => {
  resetCheckedItems();
  if (checked.value === 'true') {
    checkedItems.value = {};
    checked.value = 'false';
  } else {
    data.value.forEach((e, index) => (checkedItems.value[`${index}`] = true));
    checked.value = 'true';
  }
  $event.preventDefault();
  console.log(checked.value);
};

const setCheckedItem = (index: number) => {
  resetCheckedItems();
  checkedItems.value[`${index}`] = !checkedItems.value[`${index}`];
  const totalChecked = Object.values(checkedItems.value).filter(
    (i) => i,
  ).length;
  if (!totalChecked) {
    checked.value = 'false';
  } else if (totalChecked === Object.keys(checkedItems.value).length) {
    console.log(totalChecked);
    checked.value = 'true';
  } else {
    checked.value = 'partial';
  }
};
</script>
