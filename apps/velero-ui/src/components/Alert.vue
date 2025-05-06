<template>
  <div
    v-if="message && color === 'red'"
    class="flex items-center text-red-800 bg-red-50 dark:text-red-400 p-4 mb-4 text-sm rounded-lg dark:bg-gray-700"
    role="alert"
  >
    <FontAwesomeIcon
      :icon="icon"
      class="!w-4 !h-4 mr-2"
    />
    {{ message }}
  </div>
  <div
    v-if="message && color === 'green'"
    class="flex items-center text-green-800 bg-green-50 dark:text-green-400 p-4 mb-4 text-sm rounded-lg dark:bg-gray-700"
    role="alert"
  >
    <FontAwesomeIcon
      :icon="icon"
      class="!w-4 !h-4 mr-2"
    />
    {{ message }}
  </div>
  <div
    v-if="message && color === 'yellow'"
    class="flex items-center text-yellow-800 bg-yellow-50 dark:text-yellow-400 p-4 mb-4 text-sm rounded-lg dark:bg-gray-700"
    role="alert"
  >
    <FontAwesomeIcon
      :icon="icon"
      class="!w-4 !h-4 mr-2"
    />
    {{ message }}
  </div>
  <div
    v-if="message && color === 'blue'"
    class="flex items-center text-blue-800 bg-blue-50 dark:text-blue-400 p-4 mb-4 text-sm rounded-lg dark:bg-gray-700"
    role="alert"
  >
    <FontAwesomeIcon
      :icon="icon"
      class="!w-4 !h-4 mr-2"
    />
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { PropType } from 'vue';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

defineProps({
  message: {
    type: String,
    required: true
  },
  icon: {
    type: Object as PropType<IconDefinition>,
    required: true
  },
  color: {
    type: String,
    required: true
  },
});
</script>
