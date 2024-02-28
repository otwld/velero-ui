<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          id="checkbox-"
          aria-describedby="checkbox-1"
          type="checkbox"
          class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="checkbox-" class="sr-only">checkbox</label>
      </div>
    </td>
    <router-link
      router-link
      :to="{
        name: Pages.BACKUP_REPOSITORY.name,
        params: {
          name: data?.metadata?.name,
        },
      }"
    >
      <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ data?.metadata?.name }}
          </div>
          <div class="text-xs font-normal text-gray-500 dark:text-gray-400">
            {{ data?.metadata?.uid }}
          </div>
        </div>
      </td>
    </router-link>
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      <router-link
        v-if="data?.spec?.backupStorageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: data.spec.backupStorageLocation,
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faServer" class="w-3 h-3 mr-1.5" />
        {{ data?.spec?.backupStorageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 inline-flex items-center text-base text-gray-900 whitespace-nowrap dark:text-white"
    >
      <img
        v-if="data?.spec?.repositoryType === V1BackupRepositoryType.Kopia"
        class="h-5 w-5 mr-2"
        src="/src/assets/images/kopia.svg"
      />
      <img
        v-if="data?.spec?.repositoryType === V1BackupRepositoryType.Restic"
        class="h-5 w-5 mr-2"
        src="/src/assets/images/restic.png"
      />
      {{ data?.spec?.repositoryType }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{
        data?.status?.lastMaintenanceTime
          ? convertTimestampToDate(data?.status?.lastMaintenanceTime)
          : '-'
      }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1BackupRepositoryPhase.New"
          class="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"
        ></div>
        <div
          v-if="data?.status?.phase === V1BackupRepositoryPhase.Ready"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        ></div>
        <div
          v-if="data?.status?.phase === V1BackupRepositoryPhase.NotReady"
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        ></div>
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        ></div>
        {{ data?.status?.phase ? data.status.phase : 'Unknown' }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        type="button"
        title="Delete"
        @click="remove()"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4" />
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { V1BackupRepository } from '@velero-ui/velero';
import {
  V1BackupRepositoryPhase,
  V1BackupRepositoryType,
} from '@velero-ui/velero';
import type { PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faServer,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Pages } from '../../utils/constants.utils';
import { convertTimestampToDate } from '../../utils/date.utils';

defineProps({
  data: Object as PropType<V1BackupRepository>,
});

const remove = () => {};
</script>
