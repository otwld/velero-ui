<template>
  <span
    :class="getClass()"
    class="text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded transition duration-200"
  >
    <FontAwesomeIcon
      v-if="prefixIcon"
      :icon="prefixIcon"
      class="!w-3 !h-3 mr-1.5"
    />
    {{ text }}
    <FontAwesomeIcon
      v-if="suffixIcon"
      :icon="suffixIcon"
      class="!w-2 !h-2 ml-1.5"
    />
  </span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: undefined,
  },
  hover: {
    type: Boolean,
    required: false,
    default: false,
  },
  prefixIcon: {
    type: Object as PropType<IconDefinition>,
    required: false,
    default: undefined,
  },
  suffixIcon: {
    type: Object as PropType<IconDefinition>,
    required: false,
    default: undefined,
  },
  color: {
    type: String as PropType<
      'red' | 'green' | 'yellow' | 'blue' | 'gray' | 'orange'
    >,
    required: true,
  },
});

const getClass = () => {
  switch (props.color) {
    case 'green':
      return [
        'bg-green-100',
        'text-green-800',
        'dark:bg-green-900',
        'dark:text-green-300',
        props.hover ? ['hover:bg-green-200', 'dark:hover:bg-green-800'] : [],
      ];
    case 'gray':
      return [
        'bg-gray-100',
        'text-gray-800',
        'dark:bg-gray-700',
        'dark:text-gray-300',
        props.hover ? ['hover:bg-gray-200', 'dark:hover:bg-gray-600'] : [],
      ];
    case 'yellow':
      return [
        'bg-yellow-100',
        'text-yellow-800',
        'dark:bg-yellow-900',
        'dark:text-yellow-300',
        props.hover ? ['hover:bg-yellow-200', 'dark:hover:bg-yellow-800'] : [],
      ];
    case 'orange':
      return [
        'bg-orange-100',
        'text-orange-800',
        'dark:bg-orange-900',
        'dark:text-orange-300',
        props.hover ? ['hover:bg-orange-200', 'dark:hover:bg-orange-800'] : [],
      ];
    case 'red':
      return [
        'bg-red-100',
        'text-red-800',
        'dark:bg-red-900',
        'dark:text-red-300',
        props.hover ? ['hover:bg-red-200', 'dark:hover:bg-red-800'] : [],
      ];
    default:
      return [
        'bg-blue-100',
        'text-blue-800',
        'dark:bg-blue-900',
        'dark:text-blue-300',
        props.hover ? ['hover:bg-blue-200', 'dark:hover:bg-blue-800'] : [],
      ];
  }
};
</script>
