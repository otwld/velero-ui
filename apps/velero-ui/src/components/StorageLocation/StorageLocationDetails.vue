<template>
  <ResourceDetails :is-loading="!location">
    <template #badges>
      <Badge
        v-if="location?.spec?.default"
        :prefix-icon="faStar"
        :text="t('resource.spec.default')"
        color="green"
      />
      <Badge
        v-if="location?.spec?.accessMode"
        :text="location.spec.accessMode"
        color="blue"
      />
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
import { useI18n } from 'vue-i18n';
import ResourceDetails from '@velero-ui-app/components/Resource/ResourceDetails.vue';
import Badge from '@velero-ui-app/components/Badge.vue';

const { t } = useI18n();
defineProps({
  location: {
    type: Object as PropType<V1BackupStorageLocation>,
    required: true,
  },
});
</script>
