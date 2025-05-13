<template>
  <div class="relative z-10">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />

    <div class="fixed h-full w-full inset-0 z-10">
      <div class="flex h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div class="flex justify-end p-2">
            <button
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
              type="button"
              @click="emit('onClose')"
            >
              <FontAwesomeIcon :icon="faXmark" class="!w-5 !h-5" />
            </button>
          </div>
          <div class="p-6 pt-0 text-center">
            <FontAwesomeIcon
              :icon="icon"
              class="!w-16 !h-16 mx-auto text-gray-400 dark:text-gray-200"
            />
            <h3 class="mt-5 text-lg text-gray-500 dark:text-gray-400">
              {{ text }}
            </h3>
            <div class="overflow-y-auto max-h-96 my-2">
              <slot name="content" />
            </div>
            <button
              class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-blue-800"
              type="button"
              @click="
                emit('onConfirm');
                emit('onClose');
              "
            >
              {{ t('modal.button.yes.title') }}
            </button>
            <button
              class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              type="button"
              @click="
                emit('onCancel');
                emit('onClose');
              "
            >
              {{ t('modal.button.no.title') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    id="tooltip-force-delete"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.forceDelete') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, type PropType } from 'vue';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useI18n } from 'vue-i18n';
import { initTooltips } from 'flowbite';

const { t } = useI18n();
defineProps({
  icon: { type: Object as PropType<IconDefinition>, required: true },
  text: { type: String, required: true },
});

onMounted(() => initTooltips());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);
</script>
