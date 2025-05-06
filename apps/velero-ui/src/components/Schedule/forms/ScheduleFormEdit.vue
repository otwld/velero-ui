<template>
  <div class="flex p-4 md:p-5 justify-center flex-col sm:mx-10">
    <Form
      :is-loading="isPending"
      :not-applicable-fields="{
        backupName: true,
        scheduleName: true,
        labels: true,
      }"
      :reset="false"
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
      @dismiss-error="dismissError()"
      @on-submit="onSubmit()"
    />
  </div>
</template>

<script lang="ts" setup>
import Form from '@velero-ui-app/components/Form.vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import type { CreateFormBody, EditFormBody } from '@velero-ui/shared-types';
import {
  onBeforeMount,
  onBeforeUnmount,
  type PropType,
  shallowRef,
  watch,
} from 'vue';
import {
  Resources,
  type V1Schedule,
  type V1ScheduleSpec,
} from '@velero-ui/velero';
import ScheduleFormCreateConfirm from '@velero-ui-app/components/Schedule/forms/ScheduleFormConfirm.vue';
import ScheduleFormInfo from '@velero-ui-app/components/Schedule/forms/ScheduleFormInfo.vue';
import BackupCreateInfo from '@velero-ui-app/components/Backup/forms/BackupFormInfo.vue';
import BackupCreateResources from '@velero-ui-app/components/Backup/forms/BackupFormResources.vue';
import BackupCreateLabels from '@velero-ui-app/components/Backup/forms/BackupFormLabels.vue';
import { useI18n } from 'vue-i18n';
import { useKubernetesEditObject } from '@velero-ui-app/composables/useKubernetesEditObject';
import { parseTimeString } from '@velero-ui-app/utils/date.utils';

const props = defineProps({
  schedule: { type: Object as PropType<V1Schedule>, required: true },
});

const { mutate, isPending, isError, isSuccess } = useKubernetesEditObject(
  Resources.SCHEDULE,
  props.schedule.metadata.name
);

const { t } = useI18n();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

onBeforeMount(() => {
  formStore.setFormContent([
    {
      name: props.schedule.metadata.name,
      schedule: props.schedule.spec?.schedule,
      paused: props.schedule.spec?.paused,
      skipImmediately: props.schedule.spec?.skipImmediately,
      useOwnerReferencesInBackup: props.schedule.spec?.useOwnerReferencesInBackup,
    },
    {
      ttl: {
        value: parseTimeString(props.schedule.spec?.template?.ttl)?.value || '',
        unit: parseTimeString(props.schedule.spec?.template?.ttl)?.unit || 'h',
      },
      storageLocation: props.schedule.spec?.template?.storageLocation,
      itemOperationTimeout: {
        value:
          parseTimeString(
            props.schedule.spec?.template?.itemOperationTimeout
          )?.value || '',
        unit:
          parseTimeString(
            props.schedule.spec?.template?.itemOperationTimeout
          )?.unit || 'm',
      },
      csiSnapshotTimeout: {
        value:
          parseTimeString(
            props.schedule.spec?.template?.csiSnapshotTimeout
          )?.value || '',
        unit:
          parseTimeString(
            props.schedule.spec?.template?.csiSnapshotTimeout
          )?.unit || 'm',
      },
      snapshotMoveData: props.schedule.spec?.template?.snapshotMoveData,
      snapshotVolumes: props.schedule.spec?.template?.snapshotVolumes,
      defaultVolumesToFsBackup:
        props.schedule.spec?.template?.defaultVolumesToFsBackup,
      volumeSnapshotLocations:
        props.schedule.spec?.template?.volumeSnapshotLocations || [],
      includedNamespaces: props.schedule.spec?.template?.includedNamespaces || [],
      excludedNamespaces: props.schedule.spec?.template?.excludedNamespaces || [],
      datamover: props.schedule.spec?.template?.datamover,
      parallelFilesUpload:
        props.schedule.spec?.template?.uploaderConfig?.parallelFilesUpload,
    },
    {
      includeClusterResources:
        props.schedule.spec?.template?.includeClusterResources,
      resourcePolicy: props.schedule.spec?.template?.resourcePolicy,
      includedResources: props.schedule.spec?.template?.includedResources || [],
      excludedResources: props.schedule.spec?.template?.excludedResources || [],
      includedClusterScopedResources: props.schedule.spec?.template?.includedClusterScopedResources || [],
      excludedClusterScopedResources: props.schedule.spec?.template?.includedClusterScopedResources || [],
      includedNamespaceScopedResources: props.schedule.spec?.template?.includedNamespaceScopedResources || [],
      excludedNamespaceScopedResources: props.schedule.spec?.template?.excludedNamespaceScopedResources || [],
    },
    {
      labelSelector: { ...props.schedule.spec?.labelSelector },
    }
  ]);
});

onBeforeUnmount(() => formStore.reset());

const emit = defineEmits(['onConfirm', 'onCancel', 'onClose']);

const dismissError = () => {};

const onSubmit = () => {
  const form: EditFormBody<V1ScheduleSpec> = {
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
      parseInt(formContent.value[1].parallelFilesUpload);
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
