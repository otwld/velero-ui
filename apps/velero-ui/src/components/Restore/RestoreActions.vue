<template>
  <ResourceActions
    :icon="faClockRotateLeft"
    :name="restore?.metadata?.name"
    :uid="restore?.metadata?.uid"
  >
    <template #buttons>
      <button
        v-if="can(Action.Delete, Resources.RESTORE.plural)"
        :class="{ 'cursor-not-allowed': isDisabled || !restore }"
        :disabled="isDisabled || !restore"
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
    @on-confirm="remove({ name: restore.metadata.name })"
  >
    <template #content>
      <div class="flex justify-center">
        <p
          class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
        >
          {{ restore?.metadata?.name }}
        </p>
      </div>
    </template>
  </ModalConfirmation>
</template>

<script lang="ts" setup>
import { computed, type PropType, ref } from 'vue';
import { Resources, type V1Restore, V1RestorePhase } from '@velero-ui/velero';
import {
  faCircleNotch,
  faClockRotateLeft,
  faExclamationCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ModalConfirmation from '@velero-ui-app/components/Modals/ModalConfirmation.vue';
import { useDeleteKubernetesObject } from '@velero-ui-app/composables/useDeleteKubernetesObject';
import { useI18n } from 'vue-i18n';
import { can } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';
import ResourceActions from '@velero-ui-app/components/Resource/ResourceActions.vue';

const { t } = useI18n();

const props = defineProps({
  restore: { type: Object as PropType<V1Restore>, required: true },
});

const { isPending: isDeleting, mutate: remove } = useDeleteKubernetesObject(
  Resources.RESTORE
);

const showModalDelete = ref(false);

const isDisabled = computed(() => {
  return (
    isDeleting.value ||
    ![V1RestorePhase.Completed, V1RestorePhase.PartiallyFailed].includes(
      props.restore?.status?.phase
    )
  );
});
</script>
<script lang="ts" setup></script>
