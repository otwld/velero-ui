<template>
  <div class="relative lg:w-64 xl:w-96">
    <FormKit
      id="search"
      :name="t('list.search.name')"
      :placeholder="t('list.search.placeholder')"
      :validation="[['k8s_name']]"
      type="text"
      @keyup="handleNameSearch()"
      @keyup.enter="applyNameSearch()"
    >
      <template #suffixIcon>
        <FontAwesomeIcon
          v-if="isFetching"
          :icon="faCircleNotch"
          class="absolute right-[10px] top-[14px] !w-4 !h-4 animate-spin text-gray-400"
        />
        <button
          class="absolute right-[10px] top-[10px] transition duration-200 cursor-pointer dark:text-white"
          type="button"
        >
          <FontAwesomeIcon
            v-if="input.value && !isFetching"
            :icon="faXmark"
            class="!w-4 !h-4"
            @click="set(Filter.Search, '')"
          />
        </button>
      </template>
    </FormKit>
  </div>
</template>
<script lang="ts" setup>
import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Filter } from '@velero-ui/shared-types';
import { useFormKitContextById } from '@formkit/vue';
import { useFilters } from '@velero-ui-app/composables/search/useFilters';
import { useKubernetesWatchListObject } from '@velero-ui-app/composables/useKubernetesWatchListObject';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { onBeforeUnmount, onMounted, watch } from 'vue';

const { t } = useI18n();

const listStore = useListStore();
const { objectType, filters } = storeToRefs(listStore);
const { isFetching } = useKubernetesWatchListObject(objectType.value);

const { set } = useFilters();
const input = useFormKitContextById('search');
let timeout: NodeJS.Timeout;

const applyNameSearch = () => {
  if (input.value.state.complete) {
    set(Filter.Search, input.value.value);
  }
};

const handleNameSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    applyNameSearch();
  }, 1500);
};

onMounted(() => {
  if (filters.value[Filter.Search]) {
    input.value.node.input(filters.value[Filter.Search]);
  }
});

watch(
  filters,
  () =>
    input.value.node.input(
      filters.value[Filter.Search] ? filters.value[Filter.Search] : ''
    ),
  {
    deep: true,
  }
);

onBeforeUnmount(() => clearTimeout(timeout));
</script>
