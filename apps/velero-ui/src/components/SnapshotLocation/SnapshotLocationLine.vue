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
        ></div>
        <div
          v-if="
            data?.status?.phase === V1VolumeSnapshotLocationPhase.Unavailable
          "
          class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
        ></div>
        <div
          v-if="!data?.status?.phase"
          class="h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"
        ></div>
        {{ data?.status?.phase ? data.status.phase : 'Unknown' }}
      </div>
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-700 hover:bg-teal-800 rounded-l-lg focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          title="Edit"
          type="button"
        >
          <FontAwesomeIcon :icon="faPen" class="w-4 h-4" />
        </button>
        <button
          :class="{ 'cursor-not-allowed': isDeleting }"
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
import {
  Resources,
  type V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationPhase,
} from '@velero-ui/velero';
import { type PropType, ref } from 'vue';
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

defineProps({
  data: Object as PropType<V1VolumeSnapshotLocation>,
  checked: Boolean,
});

const showModalDelete = ref(false);

const emit = defineEmits(['onChecked']);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.VOLUME_SNAPSHOT_LOCATION,
);
</script>
