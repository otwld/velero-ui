<template class="hover:bg-gray-100 dark:hover:bg-gray-700">
  <tr>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          :checked="checked"
          class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          @click="emit('onChecked')"
        />
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
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data?.status?.processedTimestamp) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1ServerStatusRequestPhase.Processed"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        />
        <div
          v-if="data?.status?.phase === V1ServerStatusRequestPhase.New"
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
          <FontAwesomeIcon :icon="faFileCode" class="w-4 h-4" />
        </button>
        <button
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
            class="w-4 h-4 animate-spin"
          />
          <FontAwesomeIcon
            v-if="!isDeleting"
            :icon="faTrashCan"
            class="w-4 h-4"
          />
        </button>
      </div>
    </td>
  </tr>
  <div
    :id="`tooltip-button-describe-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.describe.title') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    :id="`tooltip-button-delete-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.delete.title') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :name="data?.metadata?.name"
    :text="t('modal.text.confirmation.delete')"
    @onClose="showModalDelete = false"
    @onConfirm="remove(data?.metadata?.name)"
  />
  <ModalDescribe
    v-if="showModalDescribe"
    :data="data"
    :name="data?.metadata?.name"
    @onClose="showModalDescribe = false"
  />
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, ref } from 'vue';
import {
  Resources,
  type V1ServerStatusRequest,
  V1ServerStatusRequestPhase,
} from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
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

const { t } = useI18n();
defineProps({
  data: Object as PropType<V1ServerStatusRequest>,
  checked: Boolean,
});

onMounted(() => initTooltips());

const showModalDelete = ref(false);
const showModalDescribe = ref(false);

const emit = defineEmits(['onChecked']);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.SERVER_STATUS_REQUEST,
);
</script>
