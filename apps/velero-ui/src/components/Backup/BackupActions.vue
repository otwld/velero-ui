<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon
        :icon="faFloppyDisk"
        class="w-16 h-16 mr-2 dark:text-white"
      />

      <div>
        <h3
          v-if="backup"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ backup?.metadata?.name }}
        </h3>
        <div
          v-if="!backup"
          class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div
          v-if="backup"
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ backup?.metadata?.uid }}
        </div>
        <div
          v-if="!backup"
          class="bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <button
            :class="{ 'cursor-not-allowed': isDisabled || !backup }"
            :disabled="!backup"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
            type="button"
            @click="showModalRestore = !showModalRestore"
          >
            <FontAwesomeIcon :icon="faClockRotateLeft" class="w-4 h-4 mr-2" />
            {{ t('global.button.restore.title') }}
          </button>
          <button
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
              class="w-4 h-4 mr-2"
            />
            <FontAwesomeIcon
              v-if="downloadLoading"
              :icon="faCircleNotch"
              class="w-4 h-4 animate-spin mr-2"
            />
            {{
              downloadLoading
                ? t('global.button.download.loading')
                : t('global.button.download.title')
            }}
          </button>
          <button
            :class="{ 'cursor-not-allowed': isDisabled || !backup }"
            :disabled="isDisabled || !backup"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
            type="button"
            @click="showModalDelete = !showModalDelete"
          >
            <FontAwesomeIcon
              v-if="isDeleting"
              :icon="faCircleNotch"
              class="w-4 h-4 animate-spin mr-2"
            />
            <FontAwesomeIcon
              v-if="!isDeleting"
              :icon="faTrashCan"
              class="w-4 h-4 mr-2"
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
    :name="backup?.metadata?.name"
    :text="t('modal.text.confirmation.delete')"
    @onClose="showModalDelete = false"
    @onConfirm="remove(backup.metadata.name)"
  />
  <VModal
    v-if="showModalRestore"
    :id="`modal-restore-${backup?.metadata?.name}`"
    width="lg:w-6/12"
    @onClose="showModalRestore = false"
  >
    <template v-slot:header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.restoreFromBackup') }}
        <span class="font-normal text-sm ml-2">{{ backup?.metadata?.name }}</span>
      </h3>
    </template>
    <template v-slot:content>
      <BackupFormRestore
        :backup="backup"
        @onClose="showModalRestore = false"
      />
    </template>
  </VModal>
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
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useBackupDownloadContent } from '@velero-ui-app/composables/backup/useBackupDownloadContent';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import VModal from "@velero-ui-app/components/Modals/VModal.vue";
import BackupFormRestore from "@velero-ui-app/components/Backup/forms/BackupFormRestore.vue";

const { t } = useI18n();

const props = defineProps({
  backup: Object as PropType<V1Backup>,
});

const { download, downloadLoading } = useBackupDownloadContent(
  toRef(() => props.backup?.metadata?.name),
);

const { isPending, mutate: remove } = useDeleteKubernetesObject(
  Resources.BACKUP,
);

const showModalDelete = ref(false);
const showModalRestore = ref(false);

const isDisabled = computed(() => {
  return (
    isPending.value ||
    ![V1BackupPhase.Completed, V1BackupPhase.PartiallyFailed].includes(
      props.backup?.status?.phase,
    )
  );
});

const isDeleting = computed(
  () => isPending.value || props.backup?.status?.phase === V1BackupPhase.Deleting,
);
</script>
