<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          :checked="checked"
          class="!w-4 !h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          @click="emit('onChecked')"
        >
        <label class="sr-only" for="checkbox-">checkbox</label>
      </div>
    </td>
    <router-link
      :to="{
        name: Pages.BACKUP_REPOSITORY.name,
        params: {
          name: data?.metadata?.name,
        },
      }"
      router-link
    >
      <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
          <p
            :title="data?.metadata?.name"
            class="text-base font-semibold text-gray-900 dark:text-white"
          >
            {{ truncate(data?.metadata?.name) }}
          </p>
          <p
            :title="data?.metadata?.uid"
            class="text-xs font-normal text-gray-500 dark:text-gray-400"
          >
            {{ data?.metadata?.uid }}
          </p>
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
        <FontAwesomeIcon :icon="faServer" class="!w-3 !h-3 mr-1.5" />
        {{ data?.spec?.backupStorageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="!w-2 !h-2 ml-1.5"
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
      >
      <img
        v-if="data?.spec?.repositoryType === V1BackupRepositoryType.Restic"
        class="h-5 w-5 mr-2"
        src="/src/assets/images/restic.png"
      >
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
        />
        <div
          v-if="data?.status?.phase === V1BackupRepositoryPhase.Ready"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        />
        <div
          v-if="data?.status?.phase === V1BackupRepositoryPhase.NotReady"
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        />
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        />
        {{ data?.status?.phase ? data.status.phase : t('global.unknown') }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        v-if="can(Action.Delete, Resources.BACKUP_REPOSITORY.subject)"
        :class="{ 'cursor-not-allowed': isDeleting }"
        :data-tooltip-target="`tooltip-button-delete-${data?.metadata?.uid}`"
        :disabled="isDeleting"
        :title="t('global.button.delete.title')"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
        type="button"
        @click="showModalDelete = !showModalDelete"
      >
        <FontAwesomeIcon
          v-if="isDeleting"
          :icon="faCircleNotch"
          class="!w-4 !h-4 animate-spin"
        />
        <FontAwesomeIcon
          v-else
          :icon="faTrashCan"
          class="!w-4 !h-4"
        />
      </button>
    </td>
  </tr>

  <div
    :id="`tooltip-button-delete-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.delete.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove(data?.metadata?.name)"
  >
    <template #content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ data?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
</template>

<script lang="ts" setup>
import {
  Resources,
  type V1BackupRepository,
  V1BackupRepositoryPhase,
  V1BackupRepositoryType,
} from '@velero-ui/velero';
import { onMounted, type PropType, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faCircleNotch,
  faExclamationCircle,
  faServer,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Pages } from '../../utils/constants.utils';
import { convertTimestampToDate } from '../../utils/date.utils';
import { truncate } from '../../utils/string.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useI18n } from 'vue-i18n';
import { initTooltips } from 'flowbite';
import { can } from "@velero-ui-app/utils/policy.utils";
import { Action } from "@velero-ui/shared-types";

const { t } = useI18n();
defineProps({
  data: { type: Object as PropType<V1BackupRepository>, required: true },
  checked: Boolean,
});

const showModalDelete = ref(false);

const emit = defineEmits(['onChecked']);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.BACKUP_REPOSITORY,
);
onMounted(() => initTooltips());
</script>
