<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon
        :icon="faFloppyDisk"
        class="!w-16 !h-16 mr-2 dark:text-white"
      />

      <div class="pl-3">
        <h3
          v-if="backup"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ backup?.metadata?.name }}
        </h3>
        <div
          v-else
          class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        />
        <div
          v-if="backup"
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ backup?.metadata?.uid }}
        </div>
        <div
          v-else
          class="bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        />
        <div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <button
            v-if="can(Action.Create, Resources.RESTORE.plural)"
            :class="{ 'cursor-not-allowed': isDisabled || !backup }"
            :disabled="!backup"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
            type="button"
            @click="showModalRestore = !showModalRestore"
          >
            <FontAwesomeIcon :icon="faClockRotateLeft" class="!w-4 !h-4 mr-2" />
            {{ t('global.button.restore.title') }}
          </button>
          <button
            v-if="can(Action.Download, Resources.BACKUP.plural)"
            :class="{
              'cursor-not-allowed': downloadLoading || isDisabled || !backup,
            }"
            :disabled="downloadLoading || isDisabled || !backup"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            @click="download()"
          >
            <FontAwesomeIcon
              v-if="!downloadLoading"
              :icon="faDownload"
              class="!w-4 !h-4 mr-2"
            />
            <FontAwesomeIcon
              v-else
              :icon="faCircleNotch"
              class="!w-4 !h-4 animate-spin mr-2"
            />
            {{
              downloadLoading
                ? t('global.button.download.loading')
                : t('global.button.download.title')
            }}
          </button>
          <button
            v-if="can(Action.Delete, Resources.BACKUP.plural)"
            :class="{ 'cursor-not-allowed': isDeleteDisabled || !backup }"
            :disabled="isDeleteDisabled || !backup"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
            type="button"
            @click="showModalDelete = !showModalDelete"
          >
            <FontAwesomeIcon
              v-if="isDeleting"
              :icon="faCircleNotch"
              class="!w-4 !h-4 animate-spin mr-2"
            />
            <FontAwesomeIcon v-else :icon="faTrashCan" class="!w-4 !h-4 mr-2" />
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
    @on-close="showModalDelete = false"
    @on-confirm="
      remove({ name: backup.metadata.name, forced: forceDeleteContext?.value })
    "
  >
    <template #content>
      <div class="flex justify-center flex-col">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ backup?.metadata?.name }}
        </p>
        <FormKit
          id="force-delete"
          :name="t('form.field.forceDelete')"
          outer-class="mb-2"
          type="checkbox"
          wrapper-class="flex items-center justify-center"
        >
          <template #label>
            <label
              class="flex ml-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('form.field.forceDelete') }}
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-force-delete"
              />
            </label>
          </template>
        </FormKit>
      </div>
    </template>
  </ModalConfirmation>
  <VModal
    v-if="showModalRestore"
    :id="`modal-restore-${backup?.metadata?.name}`"
    width="lg:w-6/12"
    @on-close="showModalRestore = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.restoreFromBackup') }}
        <span class="font-normal text-sm ml-2">{{
          backup?.metadata?.name
        }}</span>
      </h3>
    </template>
    <template #content>
      <BackupFormRestore
        :backup="backup"
        @on-close="showModalRestore = false"
      />
    </template>
  </VModal>
  <div
    id="tooltip-force-delete"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Delete resource instead of creating delete request.
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType, ref, toRef } from 'vue';
import { Resources, type V1Backup, V1BackupPhase } from '@velero-ui/velero';
import {
  faCircleNotch,
  faClockRotateLeft,
  faDownload,
  faExclamationCircle,
  faFloppyDisk,
  faQuestionCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useBackupDownloadContent } from '@velero-ui-app/composables/backup/useBackupDownloadContent';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import BackupFormRestore from '@velero-ui-app/components/Backup/forms/BackupFormRestore.vue';
import { Action } from '@velero-ui/shared-types';
import { can } from '@velero-ui-app/utils/policy.utils';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const props = defineProps({
  backup: {
    type: Object as PropType<V1Backup>,
    required: true,
  },
});

const { download, downloadLoading } = useBackupDownloadContent(
  toRef(() => props.backup?.metadata?.name)
);

const { isPending, mutate: remove } = useDeleteKubernetesObject(
  Resources.BACKUP
);

const forceDeleteContext = useFormKitContextById('force-delete');

const showModalDelete = ref(false);
const showModalRestore = ref(false);

const isDisabled = computed(() => {
  return (
    isPending.value ||
    ![V1BackupPhase.Completed, V1BackupPhase.PartiallyFailed].includes(
      props.backup?.status?.phase
    )
  );
});

const isDeleteDisabled = computed(
  () =>
    isPending.value ||
    [
      V1BackupPhase.New,
      V1BackupPhase.Finalizing,
      V1BackupPhase.InProgress,
      V1BackupPhase.FinalizingPartiallyFailed,
    ].includes(props.backup?.status?.phase)
);

const isDeleting = computed(
  () =>
    isPending.value || props.backup?.status?.phase === V1BackupPhase.Deleting
);
</script>
