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
    <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
      {{ data?.spec?.target?.name }}
    </td>
    <td class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white">
      {{ data?.spec?.target?.kind }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.status?.expiration ? remainingTime : '' }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1DownloadRequestPhase.Processed"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        />
        <div
          v-if="data?.status?.phase === V1DownloadRequestPhase.New"
          class="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"
        />
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        />
        {{
          data?.status?.phase
            ? t(`resource.phase.${data?.status?.phase}`)
            : t('global.unknown')
        }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          :data-tooltip-target="`tooltip-button-describe-${data?.metadata?.uid}`"
          :disabled="isDeleting"
          :title="t('global.button.describe.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-lg text-center text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          type="button"
          @click="showModalDescribe = !showModalDescribe"
        >
          <FontAwesomeIcon :icon="faFileCode" class="!w-4 !h-4" />
        </button>
        <button
          v-if="can(Action.Download, 'all')"
          :data-tooltip-target="`tooltip-button-download-${data?.metadata?.uid}`"
          :title="t('global.button.download.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          @click="download()"
        >
          <FontAwesomeIcon :icon="faDownload" class="!w-4 !h-4" />
          <div
            id="tooltip-button-download"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            role="tooltip"
          >
            Download
            <div class="tooltip-arrow" data-popper-arrow />
          </div>
        </button>
        <button
          v-if="can(Action.Delete, Resources.DOWNLOAD_REQUEST.subject)"
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
          <FontAwesomeIcon
            v-if="!isDeleting"
            :icon="faTrashCan"
            class="!w-4 !h-4"
          />
        </button>
      </div>
    </td>
  </tr>
  <div
    :id="`tooltip-button-download-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.download.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    :id="`tooltip-button-describe-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.describe.title') }}
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
  <ModalDescribe
    v-if="showModalDescribe"
    :data="data"
    :name="data?.metadata?.name"
    @on-close="showModalDescribe = false"
  />
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';
import {
  Resources,
  type V1DownloadRequest,
  V1DownloadRequestPhase,
} from '@velero-ui/velero';
import { getRemainingTime } from '../../utils/date.utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
  faDownload,
  faExclamationCircle,
  faFileCode,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { initTooltips } from 'flowbite';
import ModalDescribe from '@velero-ui-app/components/Modals/ModalDescribe.vue';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { truncate } from '../../utils/string.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import { can } from "@velero-ui-app/utils/policy.utils";
import { Action } from "@velero-ui/shared-types";

const { t } = useI18n();
const props = defineProps({
  data: {type: Object as PropType<V1DownloadRequest>, required: true },
  checked: Boolean,
});

const remainingTime = ref('');

onMounted(() => initTooltips());

const interval = setInterval(
  () =>
    (remainingTime.value = getRemainingTime(
      props.data?.status?.expiration || '0',
    )),
);

onUnmounted(() => clearInterval(interval));

const showModalDelete = ref(false);
const showModalDescribe = ref(false);

const emit = defineEmits(['onChecked']);

const download = () => window.open(props.data.status.downloadURL);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.DOWNLOAD_REQUEST,
);
</script>
