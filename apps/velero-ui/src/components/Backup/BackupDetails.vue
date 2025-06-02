<template>
  <ResourceDetails :is-loading="!spec">
    <template #badges>
      <router-link
        v-if="spec?.storageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: spec.storageLocation,
          },
        }"
      >
        <Badge
          :hover="true"
          :prefix-icon="faServer"
          :suffix-icon="faArrowUpRightFromSquare"
          :text="spec.storageLocation"
          color="blue"
        />
      </router-link>
      <router-link
        v-if="schedule"
        :to="{
          name: Pages.SCHEDULE.name,
          params: {
            name: schedule,
          },
        }"
      >
        <Badge
          :hover="true"
          :prefix-icon="faClockRotateLeft"
          :suffix-icon="faArrowUpRightFromSquare"
          :text="schedule"
          color="blue"
        />
      </router-link>
      <Badge
        v-if="spec?.ttl"
        :prefix-icon="faClock"
        :text="spec.ttl"
        color="blue"
      />
    </template>
    <template #content>
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
          >
            <Badge
              :hover="true"
              :prefix-icon="faDatabase"
              :suffix-icon="faArrowUpRightFromSquare"
              :text="location"
              color="gray"
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
      <div
        v-if="spec?.includedClusterScopedResources"
        class="mt-4 flex flex-col"
      >
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.includedClusterScopedResources')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.includedClusterScopedResources.join(', ')
        }}</i>
      </div>
      <div
        v-if="spec?.excludedClusterScopedResources"
        class="mt-4 flex flex-col"
      >
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
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.excludedClusterScopedResources')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.includedNamespaceScopedResources.join(', ')
        }}</i>
      </div>
      <div
        v-if="spec?.excludedNamespaceScopedResources"
        class="mt-4 flex flex-col"
      >
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.excludedNamespaceScopedResources')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.excludedNamespaceScopedResources.join(', ')
        }}</i>
      </div>
    </template>
  </ResourceDetails>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupSpec } from '@velero-ui/velero';
import {
  faArrowUpRightFromSquare,
  faClock,
  faClockRotateLeft,
  faDatabase,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { Pages } from '../../utils/constants.utils';
import { useI18n } from 'vue-i18n';
import ResourceDetails from '@velero-ui-app/components/Resource/ResourceDetails.vue';
import Badge from '@velero-ui-app/components/Badge.vue';

const { t } = useI18n();

defineProps({
  spec: {
    type: Object as PropType<V1BackupSpec>,
    required: true,
  },
  schedule: {
    type: String,
    required: false,
    default: undefined,
  },
});
</script>
