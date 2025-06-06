<template>
    <router-link
      :to="{
        name: Pages.RESTORE.name,
        params: {
          name: data.metadata.name,
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
            {{ data.metadata.uid }}
          </p>
        </div>
      </td>
    </router-link>
    <td
      class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400"
    >
      <router-link
        v-if="data.spec?.backupName"
        :to="{
          name: Pages.BACKUP.name,
          params: {
            name: data.spec.backupName,
          },
        }"
      >
        <Badge
          :hover="true"
          :prefix-icon="faFloppyDisk"
          :suffix-icon="faArrowUpRightFromSquare"
          :text="data.spec.backupName"
          color="gray"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      <router-link
        v-if="data.spec?.scheduleName"
        :to="{
          name: Pages.SCHEDULE.name,
          params: {
            name: data.spec.scheduleName,
          },
        }"
      >
        <Badge
          :hover="true"
          :prefix-icon="faClock"
          :suffix-icon="faArrowUpRightFromSquare"
          :text="data.spec.scheduleName"
          color="gray"
        />
      </router-link>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ convertTimestampToDate(data.status?.startTimestamp) }}
    </td>
    <td
      class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
    >
      <RestoreStatusPhaseBadge :status="data?.status?.phase" />
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          v-if="can(Action.Delete, Resources.RESTORE.plural)"
          :class="{ 'cursor-not-allowed': isDeleting }"
          :data-tooltip-target="`tooltip-button-delete-${data?.metadata?.uid}`"
          :disabled="isDeleting"
          :title="t('global.button.delete.title')"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
          type="button"
          @click="showModalDelete = !showModalDelete"
        >
          <FontAwesomeIcon
            v-if="isDeleting"
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin"
          />
          <FontAwesomeIcon v-else :icon="faTrashCan" class="!w-4 !h-4" />
        </button>
      </div>
    </td>

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
    :text="t('modal.text.confirmation.delete')"
    @on-close="showModalDelete = false"
    @on-confirm="remove({ name: data?.metadata?.name })"
  >
    <template #content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ data?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
</template>

<script lang="ts" setup>
import { Resources, type V1Restore } from '@velero-ui/velero';
import { convertTimestampToDate } from '../../utils/date.utils';
import { onMounted, type PropType, ref } from 'vue';
import {
  faArrowUpRightFromSquare,
  faCircleNotch,
  faClock,
  faExclamationCircle,
  faFloppyDisk,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { truncate } from '../../utils/string.utils';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import RestoreStatusPhaseBadge from '@velero-ui-app/components/Restore/RestoreStatusPhaseBadge.vue';
import { initTooltips } from 'flowbite';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import Badge from '@velero-ui-app/components/Badge.vue';
import { Pages } from '@velero-ui-app/utils/constants.utils';

const { t } = useI18n();
defineProps({
  data: { type: Object as PropType<V1Restore>, required: true },
});

const showModalDelete = ref(false);

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.RESTORE
);

onMounted(() => initTooltips());
</script>
