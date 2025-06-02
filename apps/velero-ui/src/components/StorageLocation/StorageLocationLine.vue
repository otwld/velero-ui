<template>
  <router-link
    :to="{
      name: Pages.STORAGE_LOCATION.name,
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
  <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
    {{ data?.spec?.provider }}
  </td>
  <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
    {{ data?.spec?.accessMode }}
  </td>
  <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
    {{ convertTimestampToDate(data?.status?.lastSyncedTime) }}
  </td>
  <td
    class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
  >
    <div class="flex items-center">
      <div
        v-if="data?.status?.phase === V1BackupStorageLocationPhase.Available"
        class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
      />
      <div
        v-if="data?.status?.phase === V1BackupStorageLocationPhase.Unavailable"
        class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
      />
      <div
        v-if="!data?.status?.phase"
        class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
      />
      {{
        data?.status?.phase
          ? t(`resource.phase.${data.status.phase}`)
          : t('global.unknown')
      }}
    </div>
  </td>
  <td class="p-4 space-x-2 whitespace-nowrap">
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button
        v-if="can(Action.Update, Resources.BACKUP_STORAGE_LOCATION.plural)"
        :class="{ 'cursor-not-allowed': isEditing }"
        :data-tooltip-target="`tooltip-button-edit-${data?.metadata?.uid}`"
        :disabled="isEditing"
        :title="t('global.button.edit.title')"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-700 hover:bg-teal-800 rounded-l-lg focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
        type="button"
        @click="showModalEdit = !showModalEdit"
      >
        <FontAwesomeIcon
          v-if="isEditing"
          :icon="faCircleNotch"
          class="!w-4 !h-4 animate-spin"
        />
        <FontAwesomeIcon v-if="!isEditing" :icon="faPen" class="!w-4 !h-4" />
      </button>
      <button
        v-if="can(Action.Delete, Resources.BACKUP_STORAGE_LOCATION.plural)"
        :class="{ 'cursor-not-allowed': isDeleting }"
        :data-tooltip-target="`tooltip-button-delete-${data?.metadata?.uid}`"
        :disabled="isDeleting"
        :title="t('global.button.delete.title')"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-r-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
        type="button"
        @click="showModalDelete = !showModalDelete"
      >
        <FontAwesomeIcon
          v-if="isDeleting"
          :icon="faCircleNotch"
          class="!w-4 !h-4 animate-spin"
        />
        <FontAwesomeIcon v-else :icon="faTrashCan" class="!w-4 !h-4" />
      </button>
    </div>
  </td>
  <div
    :id="`tooltip-button-edit-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.edit.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
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
    :name="data?.metadata?.name"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: data.metadata.name })"
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
  <VModal
    v-if="showModalEdit"
    :id="`modal-edit-${data?.metadata?.name}`"
    width="lg:w-6/12"
    @on-close="showModalEdit = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.editBackupStorageLocation') }}
        <span class="font-normal text-sm ml-2">{{ data?.metadata?.name }}</span>
      </h3>
    </template>
    <template #content>
      <StorageLocationFormEdit
        :storage-location="data"
        @on-close="showModalEdit = false"
      />
    </template>
  </VModal>
</template>

<script lang="ts" setup>
import {
  Resources,
  type V1BackupStorageLocation,
  V1BackupStorageLocationPhase,
} from '@velero-ui/velero';
import { onMounted, type PropType, ref } from 'vue';
import { convertTimestampToDate } from '../../utils/date.utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
  faExclamationCircle,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { truncate } from '../../utils/string.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { Pages } from '../../utils/constants.utils';
import { useI18n } from 'vue-i18n';
import { initTooltips } from 'flowbite';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import StorageLocationFormEdit from '@velero-ui-app/components/StorageLocation/forms/StorageLocationFormEdit.vue';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';

const { t } = useI18n();
const props = defineProps({
  data: { type: Object as PropType<V1BackupStorageLocation>, required: true },
});

const showModalDelete = ref(false);
const showModalEdit = ref(false);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.BACKUP_STORAGE_LOCATION
);

const { isPending: isEditing } = useKubernetesEditObject(
  Resources.BACKUP_STORAGE_LOCATION,
  props.data.metadata.name
);

onMounted(() => initTooltips());
</script>
