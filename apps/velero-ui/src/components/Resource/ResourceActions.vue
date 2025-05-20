<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon :icon="icon" class="!w-16 !h-16 mr-2 dark:text-white" />

      <div class="pl-3 flex flex-col">
        <h1
          v-if="name"
          class="relative group inline-flex items-center mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ name }}
          <button
            v-copy-to-clipboard="name"
            :title="t('global.button.copy.title')"
            class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon :icon="faClipboard" class="!w-5 !h-5" />
          </button>
        </h1>
        <Skeleton v-else class="mb-4" height="2.5" width="72" />
        <div
          v-if="uid"
          class="relative group inline-flex items-center mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ uid }}
          <button
            v-copy-to-clipboard="uid"
            :title="t('global.button.copy.title')"
            class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon :icon="faClipboard" class="!w-4 !h-4" />
          </button>
        </div>
        <Skeleton v-else class="mb-4" height="2" width="48" />
        <div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <slot name="buttons" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Skeleton from "@velero-ui-app/components/Skeleton.vue";

const { t } = useI18n();

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: undefined,
  },
  uid: {
    type: String,
    required: false,
    default: undefined,
  },
  icon: {
    type: Object as PropType<IconDefinition>,
    required: true,
  },
});
</script>
