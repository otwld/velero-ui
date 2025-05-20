<template>
  <ResourceDetails :is-loading="!spec">
    <template #badges>
      <router-link
        v-if="spec?.backupName"
        :to="{
          name: Pages.BACKUP.name,
          params: {
            name: spec?.backupName,
          },
        }"
        class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faFloppyDisk" class="!w-3 !h-3 mr-1.5" />
        {{ spec?.backupName }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="!w-2 !h-2 ml-1.5"
        />
      </router-link>
      <span
        v-if="spec?.itemOperationTimeout"
        class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faClock" class="!w-3 !h-3 mr-1.5" />
        {{ spec?.itemOperationTimeout }}</span
      >
    </template>
    <template #content>
      <div v-if="spec?.includedNamespaces" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.includedNamespaces')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.includedNamespaces.join(', ')
        }}</i>
      </div>
      <div v-if="spec?.excludedNamespaces" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.excludedNamespaces')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.excludedNamespaces.join(', ')
        }}</i>
      </div>
      <div v-if="spec?.includedResources" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.includedResources')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.includedResources.join(', ')
        }}</i>
      </div>
      <div v-if="spec?.excludedResources" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.excludedResources')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.excludedResources.join(', ')
        }}</i>
      </div>
    </template>
  </ResourceDetails>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1RestoreSpec } from '@velero-ui/velero';
import {
  faArrowUpRightFromSquare,
  faClock,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '../../utils/constants.utils';
import { useI18n } from 'vue-i18n';
import ResourceDetails from '@velero-ui-app/components/Resource/ResourceDetails.vue';

const { t } = useI18n();

defineProps({
  spec: { type: Object as PropType<V1RestoreSpec>, required: true },
});
</script>
