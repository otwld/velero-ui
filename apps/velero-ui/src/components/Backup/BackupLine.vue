<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          :checked="checked"
          :value="data?.metadata?.name"
          class="!w-4 !h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          @click="emit('onChecked')"
        >
        <label class="sr-only" for="checkbox">checkbox</label>
      </div>
    </td>
    <router-link
      :to="{
        name: Pages.BACKUP.name,
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
            :title="data.metadata.uid"
            class="text-xs font-normal text-gray-500 dark:text-gray-400"
          >
            {{ data.metadata.uid }}
          </p>
        </div>
      </td>
    </router-link>
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      <router-link
        v-if="data?.metadata?.labels?.['velero.io/schedule-name']"
        :title="data?.metadata?.labels?.['velero.io/schedule-name']"
        :to="{
          name: Pages.SCHEDULE.name,
          params: {
            name: data?.metadata?.labels?.['velero.io/schedule-name'],
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faClockRotateLeft" class="!w-3 !h-3 mr-1.5" />
        {{
          truncate(
            data?.metadata?.labels?.['velero.io/schedule-name'] || '',
            30
          )
        }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="!w-2 !h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
      {{
        data?.status?.startTimestamp
          ? convertTimestampToDate(data?.status?.startTimestamp)
          : ''
      }}
    </td>
    <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
      {{ data.status?.expiration ? expireTime : '' }}
    </td>
    <td class="p-4">
      <BackupStatusPhaseBadge :status="data?.status?.phase" />
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          v-if="can(Action.Create, Resources.RESTORE.subject)"
          :class="{ 'cursor-not-allowed': isDisabled }"
          :data-tooltip-target="`tooltip-button-restore-${data?.metadata?.uid}`"
          :disabled="isDisabled"
          :title="t('global.button.restore.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-l-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          type="button"
          @click="showModalRestore = !showModalRestore"
        >
          <FontAwesomeIcon :icon="faClockRotateLeft" class="!w-4 !h-4" />
        </button>
        <button
          v-if="can(Action.Download, Resources.BACKUP.subject)"
          :class="{ 'cursor-not-allowed': isDisabled || downloadLoading }"
          :data-tooltip-target="`tooltip-button-download-${data?.metadata?.uid}`"
          :disabled="isDisabled || downloadLoading"
          :title="t('global.button.download.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          @click="download()"
        >
          <FontAwesomeIcon
            v-if="!downloadLoading"
            :icon="faDownload"
            class="!w-4 !h-4"
          />
          <FontAwesomeIcon
            v-else
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin"
          />
        </button>
        <button
          v-if="can(Action.Delete, Resources.BACKUP.subject)"
          :class="{ 'cursor-not-allowed': isDeleteDisabled }"
          :data-tooltip-target="`tooltip-button-delete-${data?.metadata?.uid}`"
          :disabled="isDeleteDisabled"
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
  </tr>

  <div
    :id="`tooltip-button-restore-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.restore.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    :id="`tooltip-button-download-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.download.title') }}
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
  <VModal
    v-if="showModalRestore"
    :id="`modal-restore-${data?.metadata?.name}`"
    width="lg:w-6/12"
    @on-close="showModalRestore = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.restoreFromBackup') }}
        <span class="font-normal text-sm ml-2">{{ data?.metadata?.name }}</span>
      </h3>
    </template>
    <template #content>
      <BackupFormRestore :backup="data" @on-close="showModalRestore = false" />
    </template>
  </VModal>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  onUnmounted,
  type PropType,
  ref,
  toRef,
} from 'vue';
import { Resources, type V1Backup, V1BackupPhase } from '@velero-ui/velero';
import {
  convertTimestampToDate,
  getRemainingTime,
} from '../../utils/date.utils';
import BackupStatusPhaseBadge from './BackupStatusPhaseBadge.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faCircleNotch,
  faClockRotateLeft,
  faDownload,
  faExclamationCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { initTooltips } from 'flowbite';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { useBackupDownloadContent } from '@velero-ui-app/composables/backup/useBackupDownloadContent';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { truncate } from '../../utils/string.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import BackupFormRestore from '@velero-ui-app/components/Backup/forms/BackupFormRestore.vue';
import { can } from "@velero-ui-app/utils/policy.utils";
import { Action } from "@velero-ui/shared-types";

const { t } = useI18n();
const props = defineProps({
  data: {
    type: Object as PropType<V1Backup>,
    required: true,
  },
  checked: Boolean,
});

onMounted(() => initTooltips());

const emit = defineEmits(['onChecked']);

const showModalDelete = ref(false);
const showModalRestore = ref(false);
const expireTime = ref('');

const { download, downloadLoading } = useBackupDownloadContent(
  toRef(() => props.data?.metadata?.name)
);

const interval = setInterval(
  () =>
    (expireTime.value = getRemainingTime(props.data?.status?.expiration || '0'))
);

onUnmounted(() => clearInterval(interval));

const { mutate: remove, isPending: isLoading } = useDeleteKubernetesObject(
  Resources.BACKUP
);

const isDisabled = computed(
  () =>
    isLoading.value ||
    ![V1BackupPhase.Completed, V1BackupPhase.PartiallyFailed].includes(
      props.data?.status?.phase
    )
);

const isDeleteDisabled = computed(
  () =>
    isLoading.value ||
    [
      V1BackupPhase.New,
      V1BackupPhase.Finalizing,
      V1BackupPhase.InProgress,
      V1BackupPhase.FinalizingPartiallyFailed,
    ].includes(props.data?.status?.phase)
);

const isDeleting = computed(
  () => isLoading.value || props.data?.status?.phase === V1BackupPhase.Deleting
);
</script>
