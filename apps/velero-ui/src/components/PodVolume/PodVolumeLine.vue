<template>
  <td class="p-4 text-gray-900 dark:text-white">
    <router-link
      :to="podVolumeDetailRoute(data.resource, data.metadata.name)"
      class="font-semibold"
      :title="data.metadata.name"
    >
      {{ truncate(data.metadata.name) }}
    </router-link>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      {{ data.metadata.uid }}
    </p>
    <Badge
      :text="
        t(data.dataMover ? 'podVolumes.dataMover' : 'podVolumes.filesystem')
      "
      color="blue"
    />
  </td>
  <td class="p-4">
    <router-link
      v-if="data.parentName"
      :to="{
        name: backup ? Pages.BACKUP.name : Pages.RESTORE.name,
        params: { name: data.parentName },
      }"
    >
      <Badge
        :hover="true"
        :prefix-icon="faFloppyDisk"
        :suffix-icon="faArrowUpRightFromSquare"
        :text="data.parentName"
        color="gray"
      />
    </router-link>
    <router-link
      v-if="!backup && data.backupName"
      :to="{ name: Pages.BACKUP.name, params: { name: data.backupName } }"
      class="block mt-1"
    >
      <Badge :hover="true" :text="data.backupName" color="gray" />
    </router-link>
  </td>
  <td class="p-4 text-gray-500 dark:text-gray-400">
    <router-link
      v-if="data.storageLocation"
      :to="{
        name: Pages.STORAGE_LOCATION.name,
        params: { name: data.storageLocation },
      }"
    >
      <Badge
        :prefix-icon="faServer"
        :suffix-icon="faArrowUpRightFromSquare"
        :text="data.storageLocation"
        color="gray"
      />
    </router-link>
  </td>
  <td class="p-4 text-gray-900 dark:text-white">
    {{ data.namespace ? `${data.namespace}/` : '' }}{{ data.volumeName }}
  </td>
  <td class="p-4 text-gray-900 dark:text-white">
    <PodVolumePhaseBadge :status="data.operation.status?.phase" />
    <div v-if="data.operation.status?.progress" class="mt-1 min-w-32">
      <p class="text-xs">
        {{ convertBytes(data.operation.status.progress.bytesDone || 0) }} /
        {{ convertBytes(data.operation.status.progress.totalBytes || 0) }}
      </p>
      <div
        class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700"
        role="progressbar"
        :aria-label="data.metadata.name"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          :style="{ width: `${percent}%` }"
          class="bg-blue-600 h-2 rounded-full"
        />
      </div>
    </div>
    <p v-if="data.operation.status?.message" class="mt-1 text-xs break-words">
      {{ data.operation.status.message }}
    </p>
  </td>
  <td class="p-4 whitespace-nowrap">
    <button
      v-if="!data.dataMover && can(Action.Delete, data.resource.plural)"
      :disabled="isDeleting"
      :title="t('global.button.delete.title')"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800"
      type="button"
      @click="showModalDelete = true"
    >
      <FontAwesomeIcon
        :icon="isDeleting ? faCircleNotch : faTrashCan"
        class="!w-4 !h-4"
        :class="{ 'animate-spin': isDeleting }"
      />
    </button>
  </td>
  <ModalConfirmation
    v-if="showModalDelete"
    :icon="faExclamationCircle"
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: data.metadata.name })"
  >
    <template #content>
      <p class="text-center mb-6 dark:text-white">
        {{ data.metadata.name }}
      </p>
    </template>
  </ModalConfirmation>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faCircleNotch,
  faExclamationCircle,
  faFloppyDisk,
  faServer,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Action } from '@velero-ui/shared-types';
import { Resources } from '@velero-ui/velero';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { truncate, convertBytes } from '@velero-ui-app/utils/string.utils';
import { progressPercent } from '@velero-ui-app/utils/volume.utils';
import {
  podVolumeDetailRoute,
  type PodVolumeListItem,
} from '@velero-ui-app/utils/pod-volume-list.utils';
import { can } from '@velero-ui-app/utils/policy.utils';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import Badge from '@velero-ui-app/components/Badge.vue';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import PodVolumePhaseBadge from './PodVolumePhaseBadge.vue';

const props = defineProps<{ data: PodVolumeListItem }>();
const { t } = useI18n();
const backup = computed(() =>
  [Resources.POD_VOLUME_BACKUP.plural, Resources.DATA_UPLOAD.plural].includes(
    props.data.resource.plural
  )
);
const percent = computed(() =>
  progressPercent(props.data.operation.status?.progress)
);
const showModalDelete = ref(false);
const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  props.data.resource
);
</script>
