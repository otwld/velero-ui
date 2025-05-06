<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :not-applicable-fields="notApplicableFields"
      :reset="false"
      :step-components="[
        {
          name: t('global.backup'),
          component: shallowRef(RestoreFormFromBackup),
        },
        {
          name: t('global.info'),
          optional: true,
          component: shallowRef(RestoreFormInfo),
        },
        {
          name: t('global.resources'),
          component: shallowRef(RestoreFormResources),
        },
        {
          name: t('global.mappingAndLabels'),
          optional: true,
          component: shallowRef(RestoreFormConfig),
        },
        {
          name: t('global.confirmation'),
          component: shallowRef(RestoreFormConfirm),
        },
      ]"
      @on-submit="onSubmit()"
    />
  </div>
</template>

<script lang="ts" setup>
import Form from '@velero-ui-app/components/Form.vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import {
  type CreateFormBody,
  CreateRestoreTypeEnum,
} from '@velero-ui/shared-types';
import {
  onBeforeMount,
  onBeforeUnmount,
  type PropType,
  shallowRef,
  watch,
} from 'vue';
import { useKubernetesCreateObject } from '@velero-ui-app/composables/useKubernetesCreateObject';
import {
  Resources,
  type V1Backup,
  type V1RestoreSpec,
} from '@velero-ui/velero';
import RestoreFormFromBackup from '@velero-ui-app/components/Restore/forms/RestoreFormFromBackup.vue';
import RestoreFormInfo from '@velero-ui-app/components/Restore/forms/RestoreFormInfo.vue';
import RestoreFormResources from '@velero-ui-app/components/Restore/forms/RestoreFormResources.vue';
import RestoreFormConfig from '@velero-ui-app/components/Restore/forms/RestoreFormConfig.vue';
import RestoreFormConfirm from '@velero-ui-app/components/Restore/forms/RestoreFormConfirm.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  backup: { type: Object as PropType<V1Backup>, required: true}
});

const { mutate, isPending, isError, isSuccess } = useKubernetesCreateObject(
  Resources.RESTORE,
);

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const notApplicableFields = {
  name: true,
  labels: true,
  backupName: true,
};

onBeforeMount(() => {
  formStore.setFormContent([
    {
      backupName: props.backup.metadata.name || '',
      type: CreateRestoreTypeEnum.FROM_BACKUP,
    },
  ]);
});

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const onSubmit = () => {
  const form: CreateFormBody<V1RestoreSpec> = {
    name: formContent.value[0].name,
    labels: formContent.value[3].labels,
    spec: {
      backupName: formContent.value[0].backupName,
      uploaderConfig: {},
    },
  };

  if (formContent.value[1].includedNamespaces.length > 0) {
    form.spec.includedNamespaces = formContent.value[1].includedNamespaces;
  }

  if (formContent.value[1].excludedNamespaces.length > 0) {
    form.spec.excludedNamespaces = formContent.value[1].excludedNamespaces;
  }

  if (formContent.value[1].writeSparseFiles) {
    form.spec.uploaderConfig.writeSparseFiles =
      formContent.value[1].writeSparseFiles;
  }

  if (formContent.value[1].parallelFilesDownload) {
    form.spec.uploaderConfig.parallelFilesDownload =
      parseInt(formContent.value[1].parallelFilesDownload);
  }

  if (formContent.value[1].preserveNodePorts) {
    form.spec.preserveNodePorts = formContent.value[1].preserveNodePorts;
  }

  if (formContent.value[1].restorePVs) {
    form.spec.restorePVs = formContent.value[1].restorePVs;
  }

  if (formContent.value[1].includeClusterResources) {
    form.spec.includeClusterResources =
      formContent.value[1].includeClusterResources;
  }

  if (formContent.value[1].itemOperationTimeout?.value) {
    form.spec.itemOperationTimeout =
      formContent.value[1].itemOperationTimeout.value +
      formContent.value[1].itemOperationTimeout.unit;
  }

  if (formContent.value[1].existingResourcePolicy) {
    form.spec.existingResourcePolicy =
      formContent.value[1].existingResourcePolicy;
  }

  if (formContent.value[2].resourceModifier) {
    form.spec.resourceModifier = {
      kind: 'configmap',
      name: formContent.value[2].resourceModifier,
    };
  }

  if (formContent.value[2].includedResources.length > 0) {
    form.spec.includedResources = formContent.value[2].includedResources;
  }
  if (formContent.value[2].excludedResources.length > 0) {
    form.spec.excludedResources = formContent.value[2].excludedResources;
  }

  if (
    formContent.value[2].statusIncludedResources.length > 0 ||
    formContent.value[2].statusExcludedResources.length > 0
  ) {
    form.spec.restoreStatus = {};
    if (formContent.value[2].statusIncludedResources.length > 0) {
      form.spec.restoreStatus.includedResources =
        formContent.value[2].statusIncludedResources;
    }
    if (formContent.value[2].statusExcludedResources.length > 0) {
      form.spec.restoreStatus.excludedResources =
        formContent.value[2].statusExcludedResources;
    }
  }

  if (Object.entries(formContent.value[3].labelsSelector).length > 0) {
    form.spec.labelSelector = {
      matchLabels: formContent.value[3].labelsSelector,
    };
  }

  if (Object.entries(formContent.value[3].namespaceMappings).length > 0) {
    form.spec.namespaceMapping = formContent.value[3].namespaceMappings;
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
