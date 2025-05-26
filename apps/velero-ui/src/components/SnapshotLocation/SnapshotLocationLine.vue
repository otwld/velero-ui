<template>
  <tr class="hover:bg-gray-50  dark:hover:bg-gray-600 transition duration-200">
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          :checked="checked"
          class="!w-4 !h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          @click="emit('onChecked')"
        >
        <label class="sr-only" for="checkbox-">checkbox</label>
      </div>
    </td>
    <router-link
      :to="{
        name: Pages.SNAPSHOT_LOCATION.name,
        params: {
          name: data?.metadata?.name,
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
            {{ data?.metadata?.uid }}
          </p>
        </div>
      </td>
    </router-link>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data?.spec?.provider }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <div class="flex items-center">
        <div
          v-if="data?.status?.phase === V1VolumeSnapshotLocationPhase.Available"
          class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"
        />
        <div
          v-if="
            data?.status?.phase === V1VolumeSnapshotLocationPhase.Unavailable
          "
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        />
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        />
        {{ data?.status?.phase ? t(`resource.phase.${data.status.phase}`) : t('global.unknown') }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          v-if="can(Action.Update, Resources.VOLUME_SNAPSHOT_LOCATION.plural)"
          :class="{ 'cursor-not-allowed': isEditing }"
          :data-tooltip-target="`tooltip-button-edit-${data?.metadata?.uid}`"
          :disabled="isEditing"
          :title="t('global.button.edit.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-700 hover:bg-teal-800 rounded-l-lg focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          type="button"
          @click="showModalEdit = !showModalEdit"
        >
          <FontAwesomeIcon
            v-if="isEditing"
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin"
          />
          <FontAwesomeIcon v-else :icon="faPen" class="!w-4 !h-4" />
        </button>
        <button
          v-if="can(Action.Delete, Resources.VOLUME_SNAPSHOT_LOCATION.plural)"
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
          <FontAwesomeIcon
            v-else
            :icon="faTrashCan"
            class="!w-4 !h-4"
          />
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
    :name="data?.metadata?.name"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: data.metadata.name })"
  />
  <VModal
    v-if="showModalEdit"
    :id="`modal-edit-${data?.metadata?.name}`"
    width="lg:w-6/12"
    @on-close="showModalEdit = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('modal.text.title.editVolumeSnapshotLocation') }}
        <span class="font-normal text-sm ml-2">{{ data?.metadata?.name }}</span>
      </h3>
    </template>
    <template #content>
      <SnapshotLocationFormEdit
        :volume-location="data"
        @on-close="showModalEdit = false"
      />
    </template>
  </VModal>
</template>

<script lang="ts" setup>
import {
  Resources,
  type V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationPhase,
} from '@velero-ui/velero';
import { onMounted, type PropType, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleNotch,
  faExclamationCircle,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Pages } from '../../utils/constants.utils';
import { truncate } from '../../utils/string.utils';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import { initTooltips } from 'flowbite';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import SnapshotLocationFormEdit from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormEdit.vue';
import { can } from "@velero-ui-app/utils/policy.utils";
import { Action } from "@velero-ui/shared-types";

const { t } = useI18n();
const props = defineProps({
  data: {type: Object as PropType<V1VolumeSnapshotLocation>, required: true },
  checked: Boolean,
});

const showModalDelete = ref(false);
const showModalEdit = ref(false);

const emit = defineEmits(['onChecked']);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.VOLUME_SNAPSHOT_LOCATION,
);

const { isPending: isEditing } = useKubernetesEditObject(
  Resources.VOLUME_SNAPSHOT_LOCATION,
  props.data.metadata.name,
);

onMounted(() => initTooltips());
</script>
