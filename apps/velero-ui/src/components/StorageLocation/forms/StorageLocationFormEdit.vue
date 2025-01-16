<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :not-applicable-fields="notApplicableFields"
      :reset="false"
      :step-components="[
        {
          name: t('global.info'),
          optional: false,
          component: shallowRef(StorageLocationCreateInfo),
        },
        {
          name: t('global.credentials'),
          optional: true,
          component: shallowRef(StorageLocationCreateCredential),
        },
        {
          name: t('global.configurationAndLabels'),
          optional: true,
          component: shallowRef(StorageLocationCreateConfig),
        },
        {
          name: t('global.confirmation'),
          optional: false,
          component: shallowRef(StorageLocationCreateConfirm),
        },
      ]"
      @dismissError="dismissError()"
      @onSubmit="onSubmit()"
    />
  </div>
</template>

<script lang="ts" setup>
import Form from '@velero-ui-app/components/Form.vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import StorageLocationCreateConfirm from '@velero-ui-app/components/StorageLocation/forms/StorageLocationFormConfirm.vue';
import StorageLocationCreateInfo from '@velero-ui-app/components/StorageLocation/forms/StorageLocationFormInfo.vue';
import StorageLocationCreateCredential from '@velero-ui-app/components/StorageLocation/forms/StorageLocationFormCredential.vue';
import StorageLocationCreateConfig from '@velero-ui-app/components/StorageLocation/forms/StorageLocationFormConfig.vue';
import type { EditFormBody } from '@velero-ui/shared-types';
import {
  onBeforeMount,
  onBeforeUnmount,
  type PropType,
  shallowRef,
  watch,
} from 'vue';
import {
  Resources,
  type V1BackupStorageLocation,
  V1BackupStorageLocationAccessMode,
  type V1BackupStorageLocationSpec,
} from '@velero-ui/velero';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import { parseTimeString } from '@velero-ui-app/utils/date.utils';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  storageLocation: Object as PropType<V1BackupStorageLocation>,
});

const { t } = useI18n();

const { mutate, isPending, isError, isSuccess } = useKubernetesEditObject(
  Resources.BACKUP_STORAGE_LOCATION,
  props.storageLocation.metadata.name,
);

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const notApplicableFields = {
  name: true,
  labels: true,
};

onBeforeMount(() => {
  formStore.setFormContent([
    {
      name: props.storageLocation.metadata.name,
      accessMode:
        props.storageLocation.spec?.accessMode ||
        V1BackupStorageLocationAccessMode.ReadWrite,
      bucket: props.storageLocation.spec?.objectStorage?.bucket || '',
      caCert: props.storageLocation.spec?.objectStorage?.caCert || '',
      prefix: props.storageLocation.spec?.objectStorage?.prefix || '',
      provider: props.storageLocation.spec?.provider || '',
      default: props.storageLocation.spec?.default || false,
      backupSyncPeriod:
        parseTimeString(props.storageLocation.spec?.backupSyncPeriod)?.value ||
        '1',
      backupSyncPeriodUnit:
        parseTimeString(props.storageLocation.spec?.backupSyncPeriod)?.unit ||
        'm',
      validationFrequency:
        parseTimeString(props.storageLocation.spec?.validationFrequency)
          ?.value || '1',
      validationFrequencyUnit:
        parseTimeString(props.storageLocation.spec?.validationFrequency)
          ?.unit || 'm',
    },
    {
      credential: {
        key: props.storageLocation.spec?.credential?.key || '',
        name: props.storageLocation.spec?.credential?.name || '',
      },
    },
    {
      configuration: { ...props.storageLocation.spec?.config },
    },
  ]);
});

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const dismissError = () => {};

const onSubmit = () => {
  const form: EditFormBody<V1BackupStorageLocationSpec> = {
    spec: {
      accessMode: formContent.value[0].accessMode,
      objectStorage: {
        bucket: formContent.value[0].bucket,
        caCert: formContent.value[0].caCert,
        prefix: formContent.value[0].prefix,
      },
      provider: formContent.value[0].provider,
      default: formContent.value[0].default,

      backupSyncPeriod:
        formContent.value[0].backupSyncPeriod +
        formContent.value[0].backupSyncPeriodUnit,
      validationFrequency:
        formContent.value[0].validationFrequency +
        formContent.value[0].validationFrequencyUnit,
    },
  };

  if (formContent.value[1].credential.name) {
    form.spec.credential = {
      key: formContent.value[1].credential.key,
      name: formContent.value[1].credential.name,
    };
  }

  if (Object.entries(formContent.value[2].configuration).length > 0) {
    form.spec.config = formContent.value[2].configuration;
  }
  mutate(form);
};

watch(isError, () => {
  if (isError.value) {
    formStore.previous();
  }
});

watch(isSuccess, () => {
  if (isSuccess.value) {
    emit('onClose');
  }
});
</script>
