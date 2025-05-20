<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center flex-wrap gap-x-4">
      <h1 class="text-xl font-semibold dark:text-white">
        {{ t('global.details') }}
      </h1>
      <Skeleton v-if="isLoading" />
      <Skeleton v-if="isLoading" />
      <slot name="badges" />
    </div>
    <div class="">
      <template v-if="isLoading">
        <div v-for="index of 3" :key="index" class="my-4">
          <Skeleton class="my-2" height="3" />
          <Skeleton class="my-2" width="72" />
        </div>
      </template>
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';

const { t } = useI18n();

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false,
  },
});
</script>
