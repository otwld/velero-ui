<template>
  <ResourceStatus :is-loading="!restore">
    <template #badges>
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
        <FontAwesomeIcon
          :icon="faTriangleExclamation"
          class="!w-3 !h-3 mr-1.5"
        />

        {{ restore.status.warnings }}</span
      >
    </template>
    <template #content>
      <div v-if="restore?.status?.progress" class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-base font-medium text-gray-900 dark:text-white">{{
            t('resource.status.items')
          }}</span>
          <Skeleton v-if="!restore" class="ml-4" width="24" />
          <span class="text-xs font-medium text-gray-900 dark:text-white"
            >{{ restore.status.progress?.itemsRestored || '0' }} /
            {{ restore.status.progress?.totalItems }}</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div :style="getPercent()" class="bg-blue-600 h-2.5 rounded-full" />
        </div>
      </div>
      <div v-if="!restore" class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <Skeleton />
          <Skeleton />
        </div>
        <Skeleton height="2.5" width="full" />
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
    </template>
  </ResourceStatus>
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
import ResourceStatus from '@velero-ui-app/components/Resource/ResourceStatus.vue';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';

const { t } = useI18n();
const props = defineProps({
  restore: { type: Object as PropType<V1Restore>, required: true },
});

const getPercent = () => {
  const percent = Math.round(
    ((props.restore?.status?.progress?.itemsRestored || 0) * 100) /
      props.restore?.status?.progress?.totalItems
  );
  return {
    width: `${percent}%`,
  };
};
</script>
<script lang="ts" setup></script>
