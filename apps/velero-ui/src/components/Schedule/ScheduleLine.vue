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
        name: Pages.SCHEDULE.name,
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
        v-if="data.spec.template?.storageLocation"
        :to="{
          name: Pages.STORAGE_LOCATION.name,
          params: {
            name: data.spec.template.storageLocation,
          },
        }"
        class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      >
        <FontAwesomeIcon :icon="faServer" class="w-3 h-3 mr-1.5" />
        {{ data.spec.template.storageLocation }}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-2 h-2 ml-1.5"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.spec.schedule }}
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data.status.lastBackup) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-start flex-col">
        <ScheduleStatusPhaseBadge
          :paused="data.status.paused"
          :status="data.status.phase"
        ></ScheduleStatusPhaseBadge>
        <span
          v-if="data?.spec?.paused"
          class="mt-2 bg-yellow-100 text-yellow-800 text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
        >
          Paused
        </span>
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-l-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          title="Edit"
          type="button"
        >
          <FontAwesomeIcon :icon="faPen" class="w-4 h-4" />
        </button>
        <button
          v-if="
            data?.status?.phase !== V1SchedulePhase.FailedValidation &&
            data?.spec?.paused
          "
          :data-tooltip-target="`tooltip-button-unpause-${data?.metadata?.uid}`"
          :disabled="togglePauseLoading"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900"
          title="Unpause"
          type="button"
          @click="togglePause(false)"
        >
          <FontAwesomeIcon
            v-if="!togglePauseLoading"
            :icon="faPlay"
            class="w-4 h-4"
          />
          <FontAwesomeIcon
            v-if="togglePauseLoading"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
          <div
            :id="`tooltip-button-unpause-${data?.metadata?.uid}`"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            role="tooltip"
          >
            Unpause
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </button>
        <button
          v-if="
            data?.status?.phase !== V1SchedulePhase.FailedValidation &&
            !data?.spec?.paused
          "
          :data-tooltip-target="`tooltip-button-pause-${data?.metadata?.uid}`"
          :disabled="togglePauseLoading"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          title="Pause"
          type="button"
          @click="togglePause(true)"
        >
          <FontAwesomeIcon
            v-if="!togglePauseLoading"
            :icon="faPause"
            class="w-4 h-4"
          />
          <FontAwesomeIcon
            v-if="togglePauseLoading"
            :icon="faCircleNotch"
            class="w-4 h-4 animate-spin"
          />
          <div
            :id="`tooltip-button-pause-${data?.metadata?.uid}`"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            role="tooltip"
          >
            Pause
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </button>

        <button
          :class="{ 'cursor-not-allowed': isDeleting }"
          :data-tooltip-target="`tooltip-button-delete-${data?.metadata?.uid}`"
          :disabled="isDeleting"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-r-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
          title="Delete"
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
          <div
            :id="`tooltip-button-delete-${data?.metadata?.uid}`"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            role="tooltip"
          >
            Delete
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </button>
      </div>
    </td>
  </tr>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :name="data?.metadata?.name"
    text="Are you sure you want to delete:"
    @onClose="showModalDelete = false"
    @onConfirm="remove(data.metadata.name)"
  />
</template>

<script lang="ts" setup>
import { Resources, type V1Schedule, V1SchedulePhase } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { onMounted, type PropType, ref, toRef } from 'vue';
import {
  faArrowUpRightFromSquare,
  faCircleNotch,
  faExclamationCircle,
  faPause,
  faPen,
  faPlay,
  faServer,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ScheduleStatusPhaseBadge from './ScheduleStatusPhaseBadge.vue';
import { initTooltips } from 'flowbite';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { truncate } from '../../utils/string.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { usePauseSchedule } from '@velero-ui-app/composables/schedule/usePauseSchedule';

const props = defineProps({
  data: Object as PropType<V1Schedule>,
  checked: Boolean,
});

const emit = defineEmits(['onChecked']);

onMounted(() => initTooltips());

const showModalDelete = ref(false);

const { mutate: togglePause, isPending: togglePauseLoading } = usePauseSchedule(
  toRef(() => props.data?.metadata?.name),
);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.SCHEDULE,
);
</script>
