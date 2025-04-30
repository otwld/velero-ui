<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon :icon="faCube" class="!w-16 !h-16 mr-2 dark:text-white" />

      <div class="pl-3">
        <h3
          v-if="podVolume"
          class="mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ podVolume?.metadata?.name }}
        </h3>
        <div
          v-if="!podVolume"
          class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        />
        <div
          v-else
          class="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ podVolume?.metadata?.uid }}
        </div>
        <div
          v-if="!podVolume"
          class="h-1.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
        />
        <div v-if="podVolume" class="flex items-center gap-x-4 gap-y-2">
          <button
            :class="{ 'cursor-not-allowed': isDeleting || !podVolume }"
            :disabled="isDeleting || !podVolume"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
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
    @on-close="showModalDelete = false"
    @on-confirm="remove(podVolume.metadata.name)"
  >
    <template #content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ podVolume?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
</template>

<script lang="ts" setup>
import { type PropType, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  type Resource,
  type V1PodVolumeBackup,
  type V1PodVolumeRestore,
} from '@velero-ui/velero';
import {
  faCircleNotch,
  faCube,
  faExclamationCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  podVolume: Object as PropType<V1PodVolumeBackup | V1PodVolumeRestore>,
  type: Object as PropType<Resource>,
});

const showModalDelete = ref(false);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  props.type,
);
</script>
