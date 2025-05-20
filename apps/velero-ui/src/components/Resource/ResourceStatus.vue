<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center flex-wrap gap-x-4">
      <h1 class="text-xl font-semibold dark:text-white">
        {{ t('global.status') }}
      </h1>
      <Skeleton v-if="isLoading"/>
      <Skeleton v-if="isLoading"/>
      <slot name="badges" />
    </div>
    <div class="">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Skeleton from "@velero-ui-app/components/Skeleton.vue";

const { t } = useI18n();

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false,
  },
});
</script>
