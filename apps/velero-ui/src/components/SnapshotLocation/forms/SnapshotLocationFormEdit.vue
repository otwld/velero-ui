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
          component: shallowRef(SnapshotLocationFormCreateInfo),
        },
        {
          name: t('global.credentials'),
          optional: true,
          component: shallowRef(SnapshotLocationFormCreateCredential),
        },
        {
          name: t('global.configurationAndLabels'),
          optional: true,
          component: shallowRef(SnapshotLocationFormCreateConfig),
        },
        {
          name: t('global.confirmation'),
          optional: false,
          component: shallowRef(SnapshotLocationFormCreateConfirm),
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
import {
  onBeforeMount,
  onBeforeUnmount,
  type PropType,
  shallowRef,
  watch,
} from 'vue';
import {
  Resources,
  type V1VolumeSnapshotLocation,
  type V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import type { EditFormBody } from '@velero-ui/shared-types';
import SnapshotLocationFormCreateInfo from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormInfo.vue';
import SnapshotLocationFormCreateCredential from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormCredential.vue';
import SnapshotLocationFormCreateConfig from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormConfig.vue';
import SnapshotLocationFormCreateConfirm from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormConfirm.vue';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  volumeLocation: Object as PropType<V1VolumeSnapshotLocation>,
});

const { t } = useI18n();

const { mutate, isPending, isError, isSuccess } = useKubernetesEditObject(
  Resources.VOLUME_SNAPSHOT_LOCATION,
  props.volumeLocation.metadata.name,
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
      name: props.volumeLocation.metadata.name,
      provider: props.volumeLocation.spec?.provider || '',
    },
    {
      credential: {
        key: props.volumeLocation.spec?.credential?.key || '',
        name: props.volumeLocation.spec?.credential?.name || '',
      },
    },
    {
      configuration: { ...props.volumeLocation.spec.config },
    },
  ]);
});

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const dismissError = () => {};

const onSubmit = () => {
  const form: EditFormBody<V1VolumeSnapshotLocationSpec> = {
    spec: {
      provider: formContent.value[0].provider,
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
