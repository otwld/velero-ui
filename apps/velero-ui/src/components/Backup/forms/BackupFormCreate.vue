<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :step-components="[
        { name: t('global.type'), component: shallowRef(BackupCreateType) },
        {
          name: t('global.info'),
          component: shallowRef(BackupCreateTemplate),
          hidden: formContent[0]?.type === CreateBackupTypeEnum.FROM_SCRATCH,
        },
        {
          name: t('global.info'),
          component: shallowRef(BackupCreateInfo),
          hidden: formContent[0]?.type === CreateBackupTypeEnum.FROM_SCHEDULE,
        },
        {
          name: t('global.resources'),
          component: shallowRef(BackupCreateResources),
          hidden: formContent[0]?.type === CreateBackupTypeEnum.FROM_SCHEDULE,
        },
        {
          name: t('global.labels'),
          component: shallowRef(BackupCreateLabels),
          optional: true,
          hidden: formContent[0]?.type === CreateBackupTypeEnum.FROM_SCHEDULE,
        },
        {
          name: t('global.confirmation'),
          component: shallowRef(BackupCreateConfirm),
        },
      ]"
      @onSubmit="onSubmit()"
    />
  </div>
</template>

<script lang="ts" setup>
import Form from '@velero-ui-app/components/Form.vue';
import BackupCreateType from '@velero-ui-app/components/Backup/forms/BackupFormType.vue';
import BackupCreateInfo from '@velero-ui-app/components/Backup/forms/BackupFormInfo.vue';
import BackupCreateConfirm from '@velero-ui-app/components/Backup/forms/BackupFormConfirm.vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import {
  type CreateBackupScheduleBody,
  CreateBackupTypeEnum,
  type CreateFormBody,
} from '@velero-ui/shared-types';
import { onBeforeUnmount, shallowRef, watch } from 'vue';
import { useKubernetesCreateObject } from '@velero-ui-app/composables/useKubernetesCreateObject';
import { Resources, type V1BackupSpec } from '@velero-ui/velero';
import BackupCreateTemplate from '@velero-ui-app/components/Backup/forms/BackupFormSchedule.vue';
import BackupCreateResources from '@velero-ui-app/components/Backup/forms/BackupFormResources.vue';
import BackupCreateLabels from '@velero-ui-app/components/Backup/forms/BackupFormLabels.vue';
import { useI18n } from 'vue-i18n';

const { mutate, isPending, isError, isSuccess } = useKubernetesCreateObject(
  Resources.BACKUP,
);

const { t } = useI18n();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const onSubmit = () => {
  if (formContent.value[0].type === CreateBackupTypeEnum.FROM_SCHEDULE) {
    const form: CreateFormBody<CreateBackupScheduleBody> = {
      name: formContent.value[1].name,
      type: CreateBackupTypeEnum.FROM_SCHEDULE,
      spec: {
        name: formContent.value[1].schedule,
      },
    };
    mutate(form);
  } else if (formContent.value[0].type === CreateBackupTypeEnum.FROM_SCRATCH) {
    const form: CreateFormBody<V1BackupSpec> = {
      name: formContent.value[1].name,
      labels: formContent.value[3].labels,
      type: CreateBackupTypeEnum.FROM_SCRATCH,
      spec: {
        ttl: formContent.value[1].ttl + formContent.value[1].ttlUnit,
        volumeSnapshotLocations: formContent.value[1].volumeSnapshotLocations,
        storageLocation: formContent.value[1].storageLocation,
        snapshotVolumes: formContent.value[1].snapshotVolumes,
        snapshotMoveData: formContent.value[1].snapshotMoveData,
        defaultVolumesToFsBackup: formContent.value[1].defaultVolumesToFsBackup,
        itemOperationTimeout:
          formContent.value[1].itemOperationTimeout +
          formContent.value[1].itemOperationTimeoutUnit,
        csiSnapshotTimeout:
          formContent.value[1].csiSnapshotTimeout +
          formContent.value[1].csiSnapshotTimeoutUnit,
        includeClusterResources: formContent.value[2].includeClusterResources,
      },
    };

    if (formContent.value[1].includedNamespaces.length > 0) {
      form.spec.includedNamespaces = formContent.value[1].includedNamespaces;
    }

    if (formContent.value[1].excludedNamespaces.length > 0) {
      form.spec.excludedNamespaces = formContent.value[1].excludedNamespaces;
    }

    if (formContent.value[1].datamover) {
      form.spec.datamover = formContent.value[1].datamover;
    }

    if (formContent.value[1].parallelFilesUpload) {
      form.spec.uploaderConfig = {};
      form.spec.uploaderConfig.parallelFilesUpload =
        formContent.value[1].parallelFilesUpload;
    }

    if (formContent.value[2].resourcePolicy) {
      form.spec.resourcePolicy = {
        kind: 'configmap',
        name: formContent.value[2].resourcePolicy,
      };
    }
    if (formContent.value[2].includeClusterResources) {
      if (formContent.value[2].includedResources.length > 0) {
        form.spec.includedResources = formContent.value[2].includedResources;
      }
      if (formContent.value[2].excludedResources.length > 0) {
        form.spec.excludedResources = formContent.value[2].excludedResources;
      }
    }

    if (!formContent.value[2].includeClusterResources) {
      if (formContent.value[2].includedClusterScopedResources.length > 0) {
        form.spec.includedClusterScopedResources =
          formContent.value[2].includedClusterScopedResources;
      }
      if (formContent.value[2].excludedClusterScopedResources.length > 0) {
        form.spec.excludedClusterScopedResources =
          formContent.value[2].excludedClusterScopedResources;
      }
      if (formContent.value[2].includedNamespaceScopedResources.length > 0) {
        form.spec.includedNamespaceScopedResources =
          formContent.value[2].includedNamespaceScopedResources;
      }
      if (formContent.value[2].excludedNamespaceScopedResources.length > 0) {
        form.spec.excludedNamespaceScopedResources =
          formContent.value[2].excludedNamespaceScopedResources;
      }
    }

    if (Object.entries(formContent.value[3].labelsSelector).length > 0) {
      form.spec.labelSelector = {
        matchLabels: formContent.value[3].labelsSelector,
      };
    }
    mutate(form);
  }
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
