<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :step-components="[
        { name: t('global.type'), component: shallowRef(RestoreFormCreateType) },
        {
          name: t('resource.spec.schedule'),
          component: shallowRef(RestoreFormCreateFromSchedule),
          hidden: formContent[0]?.type === CreateRestoreTypeEnum.FROM_BACKUP,
        },
        {
          name: t('resource.spec.backup'),
          component: shallowRef(RestoreFormCreateFromBackup),
          hidden: formContent[0]?.type === CreateRestoreTypeEnum.FROM_SCHEDULE,
        },
        {
          name: t('global.info'),
          optional: true,
          component: shallowRef(RestoreFormCreateInfo),
        },
        {
          name: t('global.resources'),
          component: shallowRef(RestoreFormCreateResources),
        },
        {
          name: t('global.mappingAndLabels'),
          optional: true,
          component: shallowRef(RestoreFormCreateConfig),
        },
        {
          name: t('global.confirmation'),
          component: shallowRef(RestoreFormCreateConfirm),
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
import {
  type CreateFormBody,
  CreateRestoreTypeEnum,
} from '@velero-ui/shared-types';
import { shallowRef, watch } from 'vue';
import { useKubernetesCreateObject } from '@velero-ui-app/composables/useKubernetesCreateObject';
import { Resources, type V1RestoreSpec } from '@velero-ui/velero';
import RestoreFormCreateType from '@velero-ui-app/components/Restore/forms/RestoreFormType.vue';
import RestoreFormCreateFromSchedule from '@velero-ui-app/components/Restore/forms/RestoreFormFromSchedule.vue';
import RestoreFormCreateFromBackup from '@velero-ui-app/components/Restore/forms/RestoreFormFromBackup.vue';
import RestoreFormCreateInfo from '@velero-ui-app/components/Restore/forms/RestoreFormInfo.vue';
import RestoreFormCreateResources from '@velero-ui-app/components/Restore/forms/RestoreFormResources.vue';
import RestoreFormCreateConfig from '@velero-ui-app/components/Restore/forms/RestoreFormConfig.vue';
import RestoreFormCreateConfirm from '@velero-ui-app/components/Restore/forms/RestoreFormConfirm.vue';
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const { mutate, isPending, isError, isSuccess } = useKubernetesCreateObject(
  Resources.RESTORE,
);

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const onSubmit = () => {
  const form: CreateFormBody<V1RestoreSpec> = {
    name: formContent.value[1].name,
    labels: formContent.value[4].labels,
    spec: {
      uploaderConfig: {
        writeSparseFiles: formContent.value[2].writeSparseFiles,
        parallelFilesDownload: formContent.value[2].parallelFilesDownload,
      },
      includeClusterResources: formContent.value[2].includeClusterResources,
      restorePVs: formContent.value[2].restorePVs,
      preserveNodePorts: formContent.value[2].preserveNodePorts,
      itemOperationTimeout:
        formContent.value[2].itemOperationTimeout +
        formContent.value[2].itemOperationTimeoutUnit,
      existingResourcePolicy: formContent.value[2].existingResourcePolicy,
    },
  };

  if (formContent.value[0].type === CreateRestoreTypeEnum.FROM_BACKUP) {
    form.spec.backupName = formContent.value[1].backupName;
  } else if (
    formContent.value[0].type === CreateRestoreTypeEnum.FROM_SCHEDULE
  ) {
    form.spec.scheduleName = formContent.value[1].scheduleName;
  }

  if (formContent.value[2].includedNamespaces.length > 0) {
    form.spec.includedNamespaces = formContent.value[2].includedNamespaces;
  }

  if (formContent.value[2].excludedNamespaces.length > 0) {
    form.spec.excludedNamespaces = formContent.value[2].excludedNamespaces;
  }

  if (formContent.value[3].resourceModifier) {
    form.spec.resourceModifier = {
      kind: 'configmap',
      name: formContent.value[3].resourceModifier,
    };
  }

  if (formContent.value[3].includedResources.length > 0) {
    form.spec.includedResources = formContent.value[3].includedResources;
  }
  if (formContent.value[3].excludedResources.length > 0) {
    form.spec.excludedResources = formContent.value[3].excludedResources;
  }

  if (
    formContent.value[3].statusIncludedResources.length > 0 ||
    formContent.value[3].statusExcludedResources.length > 0
  ) {
    form.spec.restoreStatus = {};
    if (formContent.value[3].statusIncludedResources.length > 0) {
      form.spec.restoreStatus.includedResources =
        formContent.value[3].statusIncludedResources;
    }
    if (formContent.value[3].statusExcludedResources.length > 0) {
      form.spec.restoreStatus.excludedResources =
        formContent.value[3].statusExcludedResources;
    }
  }

  if (Object.entries(formContent.value[4].labelsSelector).length > 0) {
    form.spec.labelSelector = {
      matchLabels: formContent.value[4].labelsSelector,
    };
  }

  if (Object.entries(formContent.value[4].namespaceMappings).length > 0) {
    form.spec.namespaceMapping = formContent.value[4].namespaceMappings;
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
