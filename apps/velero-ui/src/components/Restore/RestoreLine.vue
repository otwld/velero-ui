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
    <router-link
      :to="{
        name: Pages.RESTORE.name,
        params: {
          name: data.metadata.name,
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
            {{ data.metadata.uid }}
          </p>
        </div>
      </td>
    </router-link>
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      <router-link
        v-if="data.spec?.backupName"
        :to="{
          name: Pages.BACKUP.name,
          params: {
            name: data.spec?.backupName,
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faFloppyDisk" class="w-3 h-3 mr-1.5" />
        {{ data.spec?.backupName }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      <router-link
        v-if="data.spec?.scheduleName"
        :to="{
          name: Pages.SCHEDULE.name,
          params: {
            name: data.spec?.scheduleName,
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faClock" class="w-3 h-3 mr-1.5" />
        {{ data.spec?.scheduleName }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data.status.startTimestamp) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <RestoreStatusPhaseBadge :status="data?.status.phase" />
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
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
    :text="t('modal.text.confirmation.delete')"
    @onClose="showModalDelete = false"
    @onConfirm="remove(data?.metadata?.name)"
  >
    <template v-slot:content>
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
import { Resources, type V1Restore } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { onMounted, type PropType, ref } from 'vue';
import {
  faArrowUpRightFromSquare,
  faCircleNotch,
  faClock,
  faExclamationCircle,
  faFloppyDisk,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { truncate } from '../../utils/string.utils';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import RestoreStatusPhaseBadge from '@velero-ui-app/components/Restore/RestoreStatusPhaseBadge.vue';
import { initTooltips } from 'flowbite';

const { t } = useI18n();
defineProps({
  data: Object as PropType<V1Restore>,
  checked: Boolean,
});

const showModalDelete = ref(false);

const emit = defineEmits(['onChecked']);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.RESTORE,
);

onMounted(() => initTooltips());
</script>
