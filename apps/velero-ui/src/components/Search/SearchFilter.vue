<template>
  <div>
    <div class="relative mt-1 lg:w-48">
      <FormKit
        :id="type"
        :options="
          [
            {
              label: t(`list.filter.${type}.placeholder`),
              value: undefined,
              attrs: { disabled: false },
            },
          ].concat(
            availableFilters?.[type]?.map((i) => ({
              label: i.value,
              value: i.value,
              attrs: { disabled: i.disabled },
            })) || []
          )
        "
        :validation="[]"
        type="select"
        @change="set(type, input.value)"
      >
        <template #label>
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t(`list.filter.${type}.label`) }}
          </label>
        </template>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useListStore } from '@velero-ui-app/stores/list.store';
import { onMounted, type PropType, watch } from 'vue';
import { Filter } from '@velero-ui/shared-types';
import { storeToRefs } from 'pinia';
import { useFormKitContextById } from '@formkit/vue';
import { useI18n } from 'vue-i18n';
import { useFilters } from '@velero-ui-app/composables/search/useFilters';

const { t } = useI18n();
const listStore = useListStore();
const { set } = useFilters();
const { availableFilters, filters } = storeToRefs(listStore);

const props = defineProps({
  type: {
    type: String as PropType<Filter>,
    required: true,
  },
});

const input = useFormKitContextById(props.type);

onMounted(() => {
  if (props.type && filters.value[props.type]) {
    input.value.node.input(filters.value[props.type]);
  }
});

watch(
  filters,
  () =>
    input.value.node?.input(
      props.type && filters.value[props.type]
        ? filters.value[props.type]
        : undefined
    ),
  {
    deep: true,
  }
);
</script>
