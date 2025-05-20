<template>
  <ResourceDetails :is-loading="!location">
    <template #badges>
      <span
        v-if="location?.spec?.default"
        class="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
      >
        <FontAwesomeIcon :icon="faStar" class="!w-3 !h-3 mr-1.5" />
        {{ t('resource.spec.default') }}</span
      >
      <span
        v-if="location?.spec?.accessMode"
        class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        {{ location.spec.accessMode }}</span
      >
    </template>
    <template #content>
      <div v-if="location?.spec?.provider" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.provider')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          location.spec.provider
        }}</i>
      </div>
      <div v-if="location?.spec?.backupSyncPeriod" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.backupSyncPeriod')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          location.spec.backupSyncPeriod
        }}</i>
      </div>
      <div
        v-if="location?.spec?.validationFrequency"
        class="mt-4 flex flex-col"
      >
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.validationFrequency')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          location.spec.validationFrequency
        }}</i>
      </div>
      <div
        v-if="location?.spec?.objectStorage?.bucket"
        class="mt-4 flex flex-col"
      >
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.bucket')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          location.spec.objectStorage.bucket
        }}</i>
      </div>
    </template>
  </ResourceDetails>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupStorageLocation } from '@velero-ui/velero';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import ResourceDetails from '@velero-ui-app/components/Resource/ResourceDetails.vue';

const { t } = useI18n();
defineProps({
  location: {
    type: Object as PropType<V1BackupStorageLocation>,
    required: true,
  },
});

</script>
