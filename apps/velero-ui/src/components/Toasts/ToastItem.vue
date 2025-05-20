<template>
  <div
    id="toast"
    class="flex items-center w-full max-w-xs px-3 py-2 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-700 "
    role="alert"
  >
    <div
      v-if="type === ToastType.SUCCESS"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    >
      <FontAwesomeIcon :icon="icon || faCheckCircle" class="!w-5 !h-5" />
    </div>

    <div
      v-if="type === ToastType.ERROR"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
    >
      <FontAwesomeIcon :icon="icon || faXmarkCircle" class="!w-5 !h-5" />
    </div>

    <div
      v-if="type === ToastType.WARNING"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-800 dark:text-orange-200"
    >
      <FontAwesomeIcon :icon="icon || faExclamationCircle" class="!w-5 !h-5" />
    </div>

    <div
      v-if="type === ToastType.INFO"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200"
    >
      <FontAwesomeIcon :icon="icon || faCircleInfo" class="!w-5 !h-5" />
    </div>

    <div class="ml-3 text-sm font-normal">
      {{ message }}
    </div>
    <button
      type="button"
      class="ml-auto m-1 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-400 dark:hover:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label="Close"
      @click="emit('onDismiss')"
    >
      <span class="sr-only">Close</span>
      <FontAwesomeIcon :icon="faXmark" class="!w-3 !h-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faXmark,
  faXmarkCircle,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { ToastType } from '@velero-ui-app/stores/toasts.store';

defineProps({
  icon: {type: Object as PropType<IconDefinition>, required: true },
  message: {type: String, required: true },
  type: {type: String as PropType<ToastType>, required: true },
});

const emit = defineEmits(['onDismiss']);
</script>
