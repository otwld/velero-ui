<template>
  <div aria-hidden="true" class="relative z-10" tabindex="-1">
    <div
      aria-hidden="true"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
      >
        <div class="relative p-4 w-full max-w-4xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div
              class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600"
            >
              <h3
                class="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white"
              >
                <slot name="header"></slot>
              </h3>
              <button
                @click="emit('onClose')"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                title="Close"
                type="button"
              >
                <FontAwesomeIcon :icon="faXmark" class="w-5 h-5" />
              </button>
            </div>
            <div class="p-4 md:p-5">
              <slot name="content" @onClose="emit('onClose')"></slot>
            </div>

            <div
              v-if="footer"
              class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  footer: Boolean,
});

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

</script>
