<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon :icon="faClock" class="!w-16 !h-16 mr-2 dark:text-white" />

      <div class="pl-3">
        <h3
          v-if="schedule"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ schedule?.metadata?.name }}
        </h3>
        <div
          v-else
          class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        />
        <div
          v-if="schedule"
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ schedule?.metadata?.uid }}
        </div>
        <div
          v-else
          class="h-1.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        />
        <div v-if="schedule" class="flex items-center gap-x-4 gap-y-2">
          <button
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
            type="button"
          >
            <FontAwesomeIcon :icon="faPen" class="!w-4 !h-4 mr-2" />
            {{ t('global.button.edit.title')}}
          </button>
          <button
            v-if="
              schedule?.status?.phase !== V1SchedulePhase.FailedValidation &&
              schedule?.spec?.paused
            "
            :disabled="togglePauseLoading"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            type="button"
            @click="togglePause(false)"
          >
            <FontAwesomeIcon
              v-if="!togglePauseLoading"
              :icon="faPlay"
              class="!w-4 !h-4 mr-2"
            />
            <FontAwesomeIcon
              v-if="togglePauseLoading"
              :icon="faCircleNotch"
              class="!w-4 !h-4 animate-spin mr-2"
            />
            {{ t('global.button.enable.title')}}
          </button>
          <button
            v-if="
              schedule?.status?.phase !== V1SchedulePhase.FailedValidation &&
              !schedule?.spec?.paused
            "
            :disabled="togglePauseLoading"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            @click="togglePause(true)"
          >
            <FontAwesomeIcon
              v-if="!togglePauseLoading"
              :icon="faPause"
              class="!w-4 !h-4 mr-2"
            />
            <FontAwesomeIcon
              v-if="togglePauseLoading"
              :icon="faCircleNotch"
              class="!w-4 !h-4 animate-spin mr-2"
            />
            {{ t('global.button.pause.title')}}
          </button>
          <button
            :class="{ 'cursor-not-allowed': isDeleting || !schedule }"
            :disabled="isDeleting || !schedule"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
            type="button"
            @click="showModalDelete = !showModalDelete"
          >
            <FontAwesomeIcon
              v-if="isDeleting"
              :icon="faCircleNotch"
              class="!w-4 !h-4 animate-spin mr-2"
            />
            <FontAwesomeIcon
              v-if="!isDeleting"
              :icon="faTrashCan"
              class="!w-4 !h-4 mr-2"
            />
            {{
              isDeleting
                ? t('global.button.delete.loading')
                : t('global.button.delete.title')
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :text="t('modal.text.confirmation.delete')"
    @onClose="showModalDelete = false"
    @onConfirm="remove(schedule.metadata.name)"
  >
    <template v-slot:content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ schedule?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
</template>

<script lang="ts" setup>
import { type PropType, ref, toRef } from 'vue';
import { Resources, type V1Schedule, V1SchedulePhase } from '@velero-ui/velero';
import {
  faCircleNotch,
  faClock,
  faExclamationCircle,
  faPause,
  faPen,
  faPlay,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { usePauseSchedule } from '@velero-ui-app/composables/schedule/usePauseSchedule';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  schedule: Object as PropType<V1Schedule>,
});

const showModalDelete = ref(false);

const { mutate: togglePause, isPending: togglePauseLoading } = usePauseSchedule(
  toRef(() => props.schedule?.metadata?.name),
);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.SCHEDULE,
);
</script>
