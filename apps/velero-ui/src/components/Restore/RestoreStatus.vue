<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center flex-wrap gap-x-4">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.status') }}
      </h3>
      <div
        v-if="!restore"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <div
        v-if="!restore"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <RestoreStatusPhaseBadge :status="restore?.status?.phase" />
      <span
        v-if="restore?.status?.errors"
        class="bg-red-100 text-red-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
      >
        <FontAwesomeIcon :icon="faCircleExclamation" class="!w-3 !h-3 mr-1.5" />
        {{ restore.status.errors }}</span
      >
      <span
        v-if="restore?.status?.warnings"
        class="bg-orange-100 text-orange-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300"
      >
        <FontAwesomeIcon :icon="faTriangleExclamation" class="!w-3 !h-3 mr-1.5" />

        {{ restore.status.warnings }}</span
      >
    </div>
    <div v-if="restore?.status?.progress" class="mt-4">
      <div class="flex items-center justify-between mb-1">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.status.items')
        }}</span>
        <div
          v-if="!restore"
          class="ml-4 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
        />
        <span class="text-xs font-medium text-gray-900 dark:text-white"
          >{{ restore.status.progress?.itemsRestored || '0' }} /
          {{ restore.status.progress?.totalItems }}</span
        >
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div :style="getPercent()" class="bg-blue-600 h-2.5 rounded-full"></div>
      </div>
    </div>
    <div v-if="!restore" class="mt-4">
      <div class="flex items-center justify-between mb-1">
        <div
          class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
        />
        <div
          class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
        />
      </div>
      <div
        class="w-full bg-gray-200 rounded-full animate-pulse h-2.5 dark:bg-gray-700"
      />
    </div>
    <div v-if="restore?.status?.failureReason" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.reason')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        restore.status.failureReason
      }}</i>
    </div>
    <div v-if="restore?.status?.validationErrors" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.status.validationErrors')
      }}</span>
      <i
        v-for="(error, index) of restore.status.validationErrors"
        :key="index"
        class="mt-1 text-xs text-gray-500 dark:text-gray-400"
      >
        - {{ error }}
      </i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1Restore } from '@velero-ui/velero';
import RestoreStatusPhaseBadge from './RestoreStatusPhaseBadge.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleExclamation,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  restore: Object as PropType<V1Restore>,
});

const getPercent = () => {
  const percent = Math.round(
    ((props.restore?.status?.progress?.itemsRestored || 0) * 100) /
      props.restore?.status?.progress?.totalItems,
  );
  return {
    width: `${percent}%`,
  };
};
</script>
