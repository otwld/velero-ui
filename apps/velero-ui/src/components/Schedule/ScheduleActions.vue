<template>
  <ResourceActions
    :icon="faClock"
    :name="schedule?.metadata?.name"
    :uid="schedule?.metadata?.uid"
  >
    <template #buttons>
      <button
        v-if="can(Action.Update, Resources.SCHEDULE.plural)"
        :class="{ 'cursor-not-allowed': isEditing || !schedule }"
        :disabled="isEditing || !schedule"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
        type="button"
        @click="showModalEdit = !showModalEdit"
      >
        <FontAwesomeIcon
          v-if="isEditing"
          :icon="faCircleNotch"
          class="!w-4 !h-4 animate-spin mr-2"
        />
        <FontAwesomeIcon
          v-if="!isEditing"
          :icon="faPen"
          class="!w-4 !h-4 mr-2"
        />
        {{ t('global.button.edit.title') }}
      </button>
      <button
        v-if="
          can(Action.Update, Resources.SCHEDULE.plural) &&
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
        {{ t('global.button.enable.title') }}
      </button>
      <button
        v-if="
          can(Action.Update, Resources.SCHEDULE.plural) &&
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
        {{ t('global.button.pause.title') }}
      </button>
      <button
        v-if="can(Action.Delete, Resources.SCHEDULE.plural)"
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
    </template>
  </ResourceActions>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: schedule.metadata.name })"
  >
    <template #content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ schedule?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
  <VModal
    v-if="showModalEdit"
    :id="`modal-edit-${schedule?.metadata?.name}`"
    width="lg:w-6/12"
    @on-close="showModalEdit = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.editSchedule') }}
        <span class="font-normal text-sm ml-2">{{
          schedule?.metadata?.name
        }}</span>
      </h3>
    </template>
    <template #content>
      <ScheduleFormEdit
        :schedule="schedule"
        @on-close="showModalEdit = false"
      />
    </template>
  </VModal>
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
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import ScheduleFormEdit from '@velero-ui-app/components/Schedule/forms/ScheduleFormEdit.vue';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import ResourceActions from '@velero-ui-app/components/Resource/ResourceActions.vue';

const { t } = useI18n();
const props = defineProps({
  schedule: { type: Object as PropType<V1Schedule>, required: true },
});

const showModalDelete = ref(false);
const showModalEdit = ref(false);

const { mutate: togglePause, isPending: togglePauseLoading } = usePauseSchedule(
  toRef(() => props.schedule?.metadata?.name)
);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.SCHEDULE
);

const { isPending: isEditing } = useKubernetesEditObject(
  Resources.SCHEDULE,
  props.schedule?.metadata.name
);
</script>
<script lang="ts" setup></script>
