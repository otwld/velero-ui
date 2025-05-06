<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :not-applicable-fields="{
        backupName: true,
      }"
      :step-components="[
        {
          name: t('global.info'),
          optional: false,
          component: shallowRef(ScheduleFormInfo),
        },
        {
          name: t('global.backupInfo'),
          optional: false,
          component: shallowRef(BackupCreateInfo),
        },
        {
          name: t('global.backupResources'),
          optional: false,
          component: shallowRef(BackupCreateResources),
        },
        {
          name: t('global.backupLabels'),
          optional: true,
          component: shallowRef(BackupCreateLabels),
        },
        {
          name: t('global.confirmation'),
          optional: false,
          component: shallowRef(ScheduleFormCreateConfirm),
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
import type { CreateFormBody } from '@velero-ui/shared-types';
import { onBeforeUnmount, shallowRef, watch } from 'vue';
import { useKubernetesCreateObject } from '@velero-ui-app/composables/useKubernetesCreateObject';
import { Resources, type V1ScheduleSpec } from '@velero-ui/velero';
import ScheduleFormCreateConfirm from '@velero-ui-app/components/Schedule/forms/ScheduleFormConfirm.vue';
import ScheduleFormInfo from '@velero-ui-app/components/Schedule/forms/ScheduleFormInfo.vue';
import BackupCreateInfo from '@velero-ui-app/components/Backup/forms/BackupFormInfo.vue';
import BackupCreateResources from '@velero-ui-app/components/Backup/forms/BackupFormResources.vue';
import BackupCreateLabels from '@velero-ui-app/components/Backup/forms/BackupFormLabels.vue';
import { useI18n } from 'vue-i18n';

const { mutate, isPending, isError, isSuccess } = useKubernetesCreateObject(
  Resources.SCHEDULE,
);

const { t } = useI18n();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const onSubmit = () => {
  const form: CreateFormBody<V1ScheduleSpec> = {
    name: formContent.value[0].name,
    labels: formContent.value[3].labels,
    spec: {
      template: {
        ttl: formContent.value[1].ttl.value + formContent.value[1].ttl.unit,
        storageLocation: formContent.value[1].storageLocation,
        includeClusterResources: formContent.value[2].includeClusterResources,
      },
      useOwnerReferencesInBackup:
        formContent.value[0].useOwnerReferencesInBackup,
      paused: formContent.value[0].paused,
      skipImmediately: formContent.value[0].skipImmediately,
      schedule: formContent.value[0].schedule,
    },
  };

  if (formContent.value[1].itemOperationTimeout?.value) {
    form.spec.template.itemOperationTimeout =
      formContent.value[1].itemOperationTimeout.value +
      formContent.value[1].itemOperationTimeout.unit;
  }

  if (formContent.value[1].csiSnapshotTimeout?.value) {
    form.spec.template.csiSnapshotTimeout =
      formContent.value[1].csiSnapshotTimeout.value +
      formContent.value[1].csiSnapshotTimeout.unit;
  }

  if (formContent.value[1].snapshotMoveData) {
    form.spec.template.snapshotMoveData = formContent.value[1].snapshotMoveData;
  }

  if (formContent.value[1].snapshotVolumes) {
    form.spec.template.snapshotVolumes = formContent.value[1].snapshotVolumes;
  }

  if (formContent.value[1].defaultVolumesToFsBackup) {
    form.spec.template.defaultVolumesToFsBackup =
      formContent.value[1].defaultVolumesToFsBackup;
  }

  if (formContent.value[1].volumeSnapshotLocations.length > 0) {
    form.spec.template.volumeSnapshotLocations =
      formContent.value[1].volumeSnapshotLocations;
  }

  if (formContent.value[1].includedNamespaces.length > 0) {
    form.spec.template.includedNamespaces =
      formContent.value[1].includedNamespaces;
  }

  if (formContent.value[1].excludedNamespaces.length > 0) {
    form.spec.template.excludedNamespaces =
      formContent.value[1].excludedNamespaces;
  }

  if (formContent.value[1].datamover) {
    form.spec.template.datamover = formContent.value[1].datamover;
  }

  if (formContent.value[1].parallelFilesUpload) {
    form.spec.template.uploaderConfig = {};
    form.spec.template.uploaderConfig.parallelFilesUpload =
      formContent.value[1].parallelFilesUpload;
  }

  if (formContent.value[2].resourcePolicy) {
    form.spec.template.resourcePolicy = {
      kind: 'configmap',
      name: formContent.value[2].resourcePolicy,
    };
  }
  if (formContent.value[2].includeClusterResources) {
    form.spec.template.includeClusterResources = true;
    if (formContent.value[2].includedResources.length > 0) {
      form.spec.template.includedResources =
        formContent.value[2].includedResources;
    }
    if (formContent.value[2].excludedResources.length > 0) {
      form.spec.template.excludedResources =
        formContent.value[2].excludedResources;
    }
  }

  if (!formContent.value[2].includeClusterResources) {
    if (!formContent.value[2].includeNamespaceClusterResources) {
      if (formContent.value[2].includedClusterScopedResources.length > 0) {
        form.spec.template.includedClusterScopedResources =
          formContent.value[2].includedClusterScopedResources;
      }
      if (formContent.value[2].excludedClusterScopedResources.length > 0) {
        form.spec.template.excludedClusterScopedResources =
          formContent.value[2].excludedClusterScopedResources;
      }
    } else {
      if (formContent.value[2].includedNamespaceScopedResources.length > 0) {
        form.spec.template.includedNamespaceScopedResources =
          formContent.value[2].includedNamespaceScopedResources;
      }
      if (formContent.value[2].excludedNamespaceScopedResources.length > 0) {
        form.spec.template.excludedNamespaceScopedResources =
          formContent.value[2].excludedNamespaceScopedResources;
      }
    }
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
