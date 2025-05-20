<template>
  <ResourceActions
    :icon="faCube"
    :name="podVolume?.metadata?.name"
    :uid="podVolume?.metadata?.uid"
  >
    <template #buttons>
      <button
        v-if="can(Action.Delete, type.pluralt)"
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
    </template>
  </ResourceActions>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: podVolume.metadata.name })"
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
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import ResourceActions from '@velero-ui-app/components/Resource/ResourceActions.vue';

const { t } = useI18n();

const props = defineProps({
  podVolume: {
    type: Object as PropType<V1PodVolumeBackup | V1PodVolumeRestore>,
    required: true,
  },
  type: { type: Object as PropType<Resource>, required: true },
});

const showModalDelete = ref(false);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  props.type
);
</script>
<script lang="ts" setup></script>
