<template>
  <div class="relative z-10" tabindex="-1">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />

    <div class="fixed h-full w-full inset-0 z-10">
      <div class="flex h-full items-center justify-center p-2 sm:p-4 sm:items-center">
        <div
          :class="[width, height]"
          class="bg-white rounded-lg shadow dark:bg-gray-800"
        >
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600"
          >
            <h3
              class="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white"
            >
              <slot name="header" />
            </h3>
            <button
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
              title="Close"
              type="button"
              @click="emit('onClose')"
            >
              <FontAwesomeIcon :icon="faXmark" class="!w-5 !h-5" />
            </button>
          </div>
          <div class="p-4 md:p-5 h-[calc(100vh-6rem)] lg:h-full overflow-y-auto">
            <slot name="content" @on-close="emit('onClose')" />
          </div>

          <div
            v-if="footer"
            class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { width = 'max-w-4xl', height = 'h-full lg:h-auto' } = defineProps({
  footer: Boolean,
  width: String,
  height: String,
});

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);
</script>
