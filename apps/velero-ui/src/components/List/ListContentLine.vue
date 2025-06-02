<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200">
    <td class="w-4 p-4">
      <input
          :checked="checked"
          :value="name"
          class="!w-4 !h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          @click="onClick()"
        />
        <label class="sr-only" for="checkbox">checkbox</label>
    </td>
    <slot name="content" />
  </tr>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useListStore } from "@velero-ui-app/stores/list.store";
import { computed } from "vue";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const listStore = useListStore();

const { checkedItems } = storeToRefs(listStore);

const props = defineProps({
  name: { type: String, required: true },
});

const checked = computed(() => checkedItems.value.has(props.name))

const onClick = () => {
  if (checked.value) {
    checkedItems.value.delete(props.name);
  } else {
    checkedItems.value.add(props.name);
  }
};

</script>
