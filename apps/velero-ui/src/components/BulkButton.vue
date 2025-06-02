<template>
  <button
    v-if="can(Action.Download, Resources.BACKUP.plural)"
    :class="disabled ? 'cursor-not-allowed text-gray-500 dark:text-gray-400' : 'text-blue-700 hover:text-blue-800 dark:hover:text-white dark:text-white'"
    :disabled="disabled"
    class="inline-flex justify-center transition duration-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    type="button"
    @click="emit('click')"
  >
    <FontAwesomeIcon v-if="!loading" :icon="icon" class="!w-5 !h-5" />
    <FontAwesomeIcon
      v-if="loading"
      :icon="faCircleNotch"
      class="!w-5 !h-5 animate-spin"
    />
  </button>
</template>
<script lang="ts" setup>
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import { Resources } from '@velero-ui/velero';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { computed, type PropType } from 'vue';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const listStore = useListStore();
const { checkedItems } = storeToRefs(listStore);

const props = defineProps({
  loading: { type: Boolean, required: false, default: false },
  icon: {
    type: Object as PropType<IconDefinition>,
    required: true,
  },
});

const emit = defineEmits(['click']);

const disabled = computed(() => {
  return checkedItems.value.size === 0 || props.loading;
});
</script>
