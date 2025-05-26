<template>
  <tr class="hover:bg-gray-50  dark:hover:bg-gray-600 transition duration-200">
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          :checked="checked"
          class="!w-4 !h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
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
      >
        <Badge
          :hover="true"
          :prefix-icon="faServer"
          :suffix-icon="faArrowUpRightFromSquare"
          :text="data.spec.template.storageLocation"
          color="gray"
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
      {{ convertTimestampToDate(data.status?.lastBackup) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-start flex-col">
        <ScheduleStatusPhaseBadge :status="data.status?.phase" />
        <Badge
          v-if="data?.spec?.paused"
          :text="t('global.paused')"
          class="mt-2"
          color="yellow"
        />
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          v-if="can(Action.Update, Resources.SCHEDULE.plural)"
          :class="{ 'cursor-not-allowed': isEditing }"
          :data-tooltip-target="`tooltip-button-edit-${data?.metadata?.uid}`"
          :disabled="isEditing"
          :title="t('global.button.edit.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-l-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
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
          v-if="
            can(Action.Update, Resources.SCHEDULE.plural) &&
            data?.status?.phase !== V1SchedulePhase.FailedValidation &&
            data?.spec?.paused
          "
          :data-tooltip-target="`tooltip-button-resume-${data?.metadata?.uid}`"
          :disabled="togglePauseLoading"
          :title="t('global.button.resume.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900"
          type="button"
          @click="togglePause(false)"
        >
          <FontAwesomeIcon
            v-if="!togglePauseLoading"
            :icon="faPlay"
            class="!w-4 !h-4"
          />
          <FontAwesomeIcon
            v-else
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin"
          />
        </button>
        <button
          v-if="
            can(Action.Update, Resources.SCHEDULE.plural) &&
            data?.status?.phase !== V1SchedulePhase.FailedValidation &&
            !data?.spec?.paused
          "
          :data-tooltip-target="`tooltip-button-pause-${data?.metadata?.uid}`"
          :disabled="togglePauseLoading"
          :title="t('global.button.pause.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          type="button"
          @click="togglePause(true)"
        >
          <FontAwesomeIcon
            v-if="!togglePauseLoading"
            :icon="faPause"
            class="!w-4 !h-4"
          />
          <FontAwesomeIcon
            v-else
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin"
          />
        </button>

        <button
          v-if="can(Action.Delete, Resources.SCHEDULE.plural)"
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
  </tr>
  <div
    :id="`tooltip-button-edit-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.edit.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    :id="`tooltip-button-resume-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.resume.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    :id="`tooltip-button-pause-${data?.metadata?.uid}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.pause.title') }}
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
        {{ t('modal.text.title.editSchedule') }}
        <span class="font-normal text-sm ml-2">{{ data?.metadata?.name }}</span>
      </h3>
    </template>
    <template #content>
      <ScheduleFormEdit :schedule="data" @on-close="showModalEdit = false" />
    </template>
  </VModal>
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
import { truncate } from '../../utils/string.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { usePauseSchedule } from '@velero-ui-app/composables/schedule/usePauseSchedule';
import { useI18n } from 'vue-i18n';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import ScheduleFormEdit from '@velero-ui-app/components/Schedule/forms/ScheduleFormEdit.vue';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import Badge from '@velero-ui-app/components/Badge.vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';

const { t } = useI18n();
const props = defineProps({
  data: { type: Object as PropType<V1Schedule>, required: true },
  checked: Boolean,
});

const emit = defineEmits(['onChecked']);

onMounted(() => initTooltips());

const showModalDelete = ref(false);
const showModalEdit = ref(false);

const { mutate: togglePause, isPending: togglePauseLoading } = usePauseSchedule(
  toRef(() => props.data?.metadata?.name)
);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.SCHEDULE
);

const { isPending: isEditing } = useKubernetesEditObject(
  Resources.SCHEDULE,
  props.data.metadata.name
);
</script>
