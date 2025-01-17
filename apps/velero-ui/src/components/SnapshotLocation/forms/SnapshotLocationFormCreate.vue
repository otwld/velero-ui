<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
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
      @onSubmit="onSubmit()"
    />
  </div>
</template>

<script lang="ts" setup>
import Form from '@velero-ui-app/components/Form.vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, shallowRef, watch } from 'vue';
import { useKubernetesCreateObject } from '@velero-ui-app/composables/useKubernetesCreateObject';
import {
  Resources,
  type V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import type { CreateFormBody } from '@velero-ui/shared-types';
import SnapshotLocationFormCreateInfo from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormInfo.vue';
import SnapshotLocationFormCreateCredential from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormCredential.vue';
import SnapshotLocationFormCreateConfig from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormConfig.vue';
import SnapshotLocationFormCreateConfirm from '@velero-ui-app/components/SnapshotLocation/forms/SnapshotLocationFormConfirm.vue';
import { useI18n } from 'vue-i18n';

const { mutate, isPending, isError, isSuccess } = useKubernetesCreateObject(
  Resources.VOLUME_SNAPSHOT_LOCATION,
);

const { t } = useI18n();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const onSubmit = () => {
  const form: CreateFormBody<V1VolumeSnapshotLocationSpec> = {
    name: formContent.value[0].name,
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

  if (Object.entries(formContent.value[2].labels).length > 0) {
    form.labels = formContent.value[2].labels;
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
