<template>
  <ResourceActions
    :icon="faDatabase"
    :name="location?.metadata?.name"
    :uid="location?.metadata?.uid"
  >
    <template #buttons>
      <button
        v-if="can(Action.Update, Resources.VOLUME_SNAPSHOT_LOCATION.plural)"
        :class="{ 'cursor-not-allowed': isEditing || !location }"
        :disabled="isEditing || !location"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
        type="button"
        @click="showModalEdit = !showModalEdit"
      >
        <FontAwesomeIcon
          v-if="isEditing"
          :icon="faCircleNotch"
          class="!w-4 !h-4 animate-spin mr-2"
        />
        <FontAwesomeIcon v-else :icon="faPen" class="!w-4 !h-4 mr-2" />
        {{ t('global.button.edit.title') }}
      </button>
      <button
        v-if="can(Action.Delete, Resources.VOLUME_SNAPSHOT_LOCATION.plural)"
        :class="{ 'cursor-not-allowed': isDeleting || !location }"
        :disabled="isDeleting || !location"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
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
    </template>
  </ResourceActions>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: location.metadata.name })"
  >
    <template #content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ location?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
  <VModal
    v-if="showModalEdit"
    :id="`modal-edit-${location?.metadata?.name}`"
    width="lg:w-6/12"
    @on-close="showModalEdit = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.editVolumeSnapshotLocation') }}
        <span class="font-normal text-sm ml-2">{{
          location?.metadata?.name
        }}</span>
      </h3>
    </template>
    <template #content>
      <SnapshotLocationFormEdit
        :volume-location="location"
        @on-close="showModalEdit = false"
      />
    </template>
  </VModal>
</template>

<script lang="ts" setup>
import { type PropType, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Resources, type V1VolumeSnapshotLocation } from '@velero-ui/velero';
import {
  faCircleNotch,
  faDatabase,
  faExclamationCircle,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import SnapshotLocationFormEdit from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormEdit.vue';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import ResourceActions from '@velero-ui-app/components/Resource/ResourceActions.vue';

const { t } = useI18n();
const props = defineProps({
  location: {
    type: Object as PropType<V1VolumeSnapshotLocation>,
    required: true,
  },
});

const showModalDelete = ref(false);
const showModalEdit = ref(false);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.VOLUME_SNAPSHOT_LOCATION
);

const { isPending: isEditing } = useKubernetesEditObject(
  Resources.VOLUME_SNAPSHOT_LOCATION,
  props.location?.metadata.name
);
</script>
<script lang="ts" setup></script>
