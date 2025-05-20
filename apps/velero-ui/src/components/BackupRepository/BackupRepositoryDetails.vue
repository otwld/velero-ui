<template>
  <ResourceDetails :is-loading="!spec">
    <template #badges>
      <img
        v-if="spec?.repositoryType === V1BackupRepositoryType.Kopia"
        :alt="spec.repositoryType"
        :title="spec.repositoryType"
        class="h-5 w-5"
        src="/src/assets/images/kopia.svg"
      />
      <img
        v-if="spec?.repositoryType === V1BackupRepositoryType.Restic"
        :alt="spec.repositoryType"
        :title="spec.repositoryType"
        class="h-5 w-5"
        src="/src/assets/images/restic.png"
      />
      <router-link
        v-if="spec?.backupStorageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: spec.backupStorageLocation,
          },
        }"
      >
        <Badge
          :hover="true"
          :prefix-icon="faServer"
          :suffix-icon="faArrowUpRightFromSquare"
          :text="spec.backupStorageLocation"
          color="blue"
        />
      </router-link>
      <Badge
        v-if="spec?.maintenanceFrequency"
        :prefix-icon="faClock"
        :text="spec.maintenanceFrequency"
        color="blue"
      />
    </template>
    <template #content>
      <div v-if="spec?.volumeNamespace" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.volumeNamespace')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.volumeNamespace
        }}</i>
      </div>
      <div v-if="spec?.resticIdentifier" class="mt-4 flex flex-col">
        <span class="text-base font-medium text-gray-900 dark:text-white">{{
          t('resource.spec.resticIdentifier')
        }}</span>
        <i class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{
          spec.resticIdentifier
        }}</i>
      </div>
    </template>
  </ResourceDetails>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { V1BackupRepositorySpec } from '@velero-ui/velero';
import { V1BackupRepositoryType } from '@velero-ui/velero';
import {
  faArrowUpRightFromSquare,
  faClock,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '../../utils/constants.utils';
import { useI18n } from 'vue-i18n';
import ResourceDetails from '@velero-ui-app/components/Resource/ResourceDetails.vue';
import Badge from '@velero-ui-app/components/Badge.vue';

const { t } = useI18n();
defineProps({
  spec: { type: Object as PropType<V1BackupRepositorySpec>, required: true },
});
</script>
