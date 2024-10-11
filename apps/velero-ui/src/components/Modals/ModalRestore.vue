<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-restore"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
      >
        <div class="relative w-full h-full max-w-md px-4 md:h-auto">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div class="flex justify-end p-2">
              <button
                type="button"
                @click="emit('onClose')"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <FontAwesomeIcon :icon="faXmark" class="w-5 h-5" />
              </button>
            </div>
            <div class="p-6 pt-0 text-center">
              <FontAwesomeIcon
                :icon="faClockRotateLeft"
                class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-200"
              />
              <h3 class="mt-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to restore:
              </h3>
              <div class="flex justify-center">
                <p
                  class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
                >
                  {{ name }}
                </p>
              </div>
              <button
                type="button"
                @click="emit('onConfirm'); emit('onClose');"
                class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-blue-800"
              >
                Yes, I'm sure
              </button>
              <button
                type="button"
                @click="emit('onCancel'); emit('onClose');"
                class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faClockRotateLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  name: String,
});

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);
</script>
