<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flex items-center flex-wrap gap-x-4">
      <h3 class="text-xl font-semibold dark:text-white">
        {{ t('global.details') }}
      </h3>
      <div
        v-if="!spec"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <div
        v-if="!spec"
        class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <router-link
        v-if="spec?.storageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: spec?.storageLocation,
          },
        }"
        class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faServer" class="!w-3 !h-3 mr-1.5" />
        {{ spec?.storageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="!w-2 !h-2 ml-1.5"
        />
      </router-link>
      <span
        v-if="spec?.ttl"
        class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        <FontAwesomeIcon :icon="faClock" class="!w-3 !h-3 mr-1.5" />
        {{ spec.ttl }}</span
      >
    </div>
    <div v-if="!spec">
      <div
        class="mt-4 h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-24"
      />
      <div
        class="mt-2 h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48"
      />
    </div>
    <div v-if="spec?.volumeSnapshotLocations" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('snapshotLocations.title')
      }}</span>
      <div class="mt-1 text-xs">
        <router-link
          v-for="(location, index) of spec.volumeSnapshotLocations"
          :key="`volume-location-${index}`"
          :to="{
            name: Pages.SNAPSHOT_LOCATION.name,
            params: {
              name: location,
            },
          }"
          class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
        >
          <FontAwesomeIcon :icon="faDatabase" class="!w-3 !h-3 mr-1.5" />
          {{ location }}
          <FontAwesomeIcon
            :icon="faArrowUpRightFromSquare"
            class="!w-2 !h-2 ml-1.5"
          />
        </router-link>
      </div>
    </div>
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
    <div v-if="spec?.includedClusterScopedResources" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.spec.includedClusterScopedResources')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec.includedClusterScopedResources.join(', ')
      }}</i>
    </div>
    <div v-if="spec?.excludedClusterScopedResources" class="mt-4 flex flex-col">
      <span class="text-base font-medium text-gray-900 dark:text-white">{{
        t('resource.spec.excludedClusterScopedResources')
      }}</span>
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec.excludedClusterScopedResources.join(', ')
      }}</i>
    </div>
    <div
      v-if="spec?.includedNamespaceScopedResources"
      class="mt-4 flex flex-col"
    >
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >{{
        t('resource.spec.excludedClusterScopedResources')
      }}</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.includedNamespaceScopedResources.join(', ')
        }}</i>
    </div>
    <div
      v-if="spec?.excludedNamespaceScopedResources"
      class="mt-4 flex flex-col"
    >
      <span class="text-base font-medium text-gray-900 dark:text-white"
        >{{
        t('resource.spec.excludedNamespaceScopedResources')
      }}</span
      >
      <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
        spec.excludedNamespaceScopedResources.join(', ')
      }}</i>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupSpec } from '@velero-ui/velero';
import {
  faArrowUpRightFromSquare,
  faClock,
  faDatabase,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '../../utils/constants.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  spec: Object as PropType<V1BackupSpec>,
});
</script>
