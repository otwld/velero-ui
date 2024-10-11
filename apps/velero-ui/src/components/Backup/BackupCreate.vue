<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :step-components="[
        { name: 'Type', component: BackupCreateType },
        { name: 'Info', component: BackupCreateInfo },
        { name: 'Confirmation', component: BackupCreateConfirm },
      ]"
      @onSubmit="onSubmit()"
    ></Form>
  </div>
</template>

<script lang="ts" setup>
import Form from '@velero-ui-app/components/Form/Form.vue';
import BackupCreateType from '@velero-ui-app/components/Backup/forms/BackupCreateType.vue';
import BackupCreateInfo from '@velero-ui-app/components/Backup/forms/BackupCreateInfo.vue';
import BackupCreateConfirm from '@velero-ui-app/components/Backup/forms/BackupCreateConfirm.vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import {
  type CreateBackupFormBody,
  CreateBackupTypeEnum,
} from '@velero-ui/shared-types';
import { useCreateBackup } from '@velero-ui-app/composables/backup/useCreateBackup';
import { watch } from 'vue';

const { mutate, isPending, isError, isSuccess } = useCreateBackup();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const onSubmit = () => {
  console.log(formContent);

  if (formContent.value[0].type === 'template') {
    const form: CreateBackupFormBody = {
      name: formContent.value[1].name,
      type: CreateBackupTypeEnum.FROM_SCHEDULE,
      data: {
        name: formContent.value[1].schedule,
      },
    };
    mutate(form);
  } else if (formContent.value[0].type === 'custom') {
    const form: CreateBackupFormBody = {
      name: formContent.value[1].name,
      labels:
        Object.fromEntries(
          formContent.value[1].labels
            .replace(/\s/g, '')
            .split(',')
            .map((e) => e.split('=')),
        ) || {},
      type: CreateBackupTypeEnum.FROM_SCRATCH,
      data: {
        ttl: formContent.value[1].ttl,
        includedNamespaces:
          formContent.value[1].includedNamespaces.length > 0
            ? formContent.value[1].includedNamespaces
            : ['*'] || ['*'],
        includedResources: formContent.value[1].includedResources
          .replace(/\s/g, '')
          .split(',') || ['*'],
        excludedNamespaces: formContent.value[1].excludedNamespaces || [],
        excludedResources:
          formContent.value[1].excludedResources
            .replace(/\s/g, '')
            .split(',') || [],
        volumeSnapshotLocations: formContent.value[1].volumeSnapshotLocations,
        storageLocation: formContent.value[1].storageLocation,
        snapshotVolumes: formContent.value[1].snapshotVolumes,
        snapshotMoveData: formContent.value[1].snapshotMoveData,
        defaultVolumesToFsBackup: formContent.value[1].defaultVolumesToFsBackup,
        includeClusterResources: formContent.value[1].includeClusterResources,
        labelSelector:
          Object.fromEntries(
            formContent.value[1].labelSelector
              .replace(/\s/g, '')
              .split(',')
              .map((e) => e.split('=')),
          ) || {},
      },
    };
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
