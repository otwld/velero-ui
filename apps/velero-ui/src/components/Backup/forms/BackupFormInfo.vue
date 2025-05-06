<template>
  <FormKit
    id="backup-form-info"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :disabled="notApplicableFields?.backupName"
            :placeholder="
              notApplicableFields?.backupName
                ? t('form.placeholder.notApplicable')
                : t('form.placeholder.backupName')
            "
            :validation="
              notApplicableFields?.backupName
                ? []
                : [['required'], ['k8s_name'], ['length', 4]]
            "
            name="name"
            type="text"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('form.field.backupName') }} *
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit name="ttl" type="group">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t('resource.spec.ttl') }} *
              <span class="pl-1 text-xs">{{ t('form.hint.ttl') }}</span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-ttl"
              />
            </label>
            <div class="flex w-full">
              <FormKit
                :placeholder="t('form.placeholder.ttl')"
                :validation="[['required'], ['number'], ['min', 1]]"
                input-class="rounded-none rounded-s-lg"
                name="value"
                outer-class="w-2/6 flex-shrink-0"
                type="number"
                value="1"
              />
              <FormKit
                :options="[
                  {
                    value: 's',
                    label: t('global.seconds'),
                  },
                  {
                    value: 'm',
                    label: t('global.minutes'),
                  },
                  {
                    value: 'h',
                    label: t('global.hours'),
                  },
                ]"
                :validation="[['required']]"
                input-class="border-s-0 rounded-s-none rounded-e-lg"
                name="unit"
                outer-class="w-4/6"
                type="select"
              />
            </div>
          </FormKit>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :disabled="!dataNamespaces || errorNamespaces"
            :options="dataNamespaces?.items"
            multiple
            name="includedNamespaces"
            type="select"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.includedNamespaces') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-included-namespace"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :disabled="!dataNamespaces || errorNamespaces"
            :options="dataNamespaces?.items"
            multiple
            name="excludedNamespaces"
            type="select"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.excludedNamespaces') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-excluded-namespace"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :disabled="!dataSnapshotLocations || errorSnapshotLocations"
            :label="t('resource.spec.volumeSnapshotLocations')"
            :options="dataStorageLocations?.items"
            multiple
            name="volumeSnapshotLocations"
            outer-class="mb-2"
            type="select"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.volumeSnapshotLocations') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-snapshot-location"
                />
              </label>
            </template>
          </FormKit>
          <FormKit
            :disabled="!dataStorageLocations || errorStorageLocations"
            :options="dataStorageLocations?.items"
            :placeholder="t('form.placeholder.storageLocation')"
            :validation="[['required']]"
            name="storageLocation"
            outer-class="mb-2"
            type="select"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.storageLocation') }} *
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-storage-location"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ t('global.options') }}
            </p>
            <label class="inline-flex items-center mb-5">
              <FormKit
                input-class="sr-only peer"
                label-class="ml-2"
                name="snapshotVolumes"
                outer-class="flex items-center"
                type="checkbox"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
              >
                <template #decorator>
                  <span
                    class="peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
              >{{ t('resource.spec.snapshotVolumes') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-snapshot-volumes"
              />
            </label>
            <label class="inline-flex items-center mb-5">
              <FormKit
                input-class="sr-only peer"
                label-class="ml-2"
                name="snapshotMoveData"
                outer-class="flex items-center"
                type="checkbox"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
              >
                <template #decorator>
                  <span
                    class="peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
              >{{ t('resource.spec.snapshotMoveData') }}</span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-snapshot-move-data"
              />
            </label>
            <label class="inline-flex items-center mb-5">
              <FormKit
                input-class="sr-only peer"
                label-class="ml-2"
                name="defaultVolumesToFsBackup"
                outer-class="flex items-center"
                type="checkbox"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
              >
                <template #decorator>
                  <span
                    class="peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
              >{{ t('resource.spec.defaultVolumesToFsBackup') }}</span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-default-volumes"
              />
            </label>
          </div>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit name="csiSnapshotTimeout" type="group">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t('resource.spec.csiSnapshotTimeout') }}
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-csi-snapshot-timeout"
              />
            </label>
            <div class="flex w-full">
              <FormKit
                :placeholder="t('form.placeholder.csiSnapshotTimeout')"
                :validation="[['number'], ['min', 0]]"
                input-class="rounded-none rounded-s-lg"
                name="value"
                outer-class="w-2/6 flex-shrink-0"
                type="number"
                value="0"
              />
              <FormKit
                :options="[
                  {
                    value: 's',
                    label: t('global.seconds'),
                  },
                  {
                    value: 'm',
                    label: t('global.minutes'),
                  },
                  {
                    value: 'h',
                    label: t('global.hours'),
                  },
                ]"
                :validation="[['required']]"
                input-class="border-s-0 rounded-s-none rounded-e-lg"
                name="unit"
                outer-class="w-4/6"
                type="select"
              />
            </div>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit name="itemOperationTimeout" type="group">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t('resource.spec.itemOperationTimeout') }}
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-item-operation-timeout"
              />
            </label>
            <div class="flex w-full">
              <FormKit
                :placeholder="t('form.placeholder.itemOperationTimeout')"
                :validation="[['number'], ['min', 0]]"
                input-class="rounded-none rounded-s-lg"
                name="value"
                outer-class="w-2/6 flex-shrink-0"
                type="number"
                value="0"
              />
              <FormKit
                :options="[
                  {
                    value: 's',
                    label: t('global.seconds'),
                  },
                  {
                    value: 'm',
                    label: t('global.minutes'),
                  },
                  {
                    value: 'h',
                    label: t('global.hours'),
                  },
                ]"
                :validation="[['required']]"
                input-class="border-s-0 rounded-s-none rounded-e-lg"
                name="unit"
                outer-class="w-4/6"
                type="select"
              />
            </div>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :placeholder="t('form.placeholder.datamover')"
            :validation="[['k8s_name']]"
            name="datamover"
            type="text"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.datamover') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-data-mover"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :placeholder="t('form.placeholder.parallelFilesUpload')"
            :validation="[['number'], ['min', 0]]"
            name="parallelFilesUpload"
            type="number"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.parallelFilesUpload') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-parallel-files-upload"
                />
              </label>
            </template>
          </FormKit>
        </div>
      </div>
    </div>
  </FormKit>

  <div
    id="tooltip-ttl"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.ttl') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-included-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedNamespaces', { type: t('global.backup', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-excluded-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedNamespaces', { type: t('global.backup', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-snapshot-location"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.volumeSnapshotLocations') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-storage-location"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.storageLocation') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-snapshot-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.snapshotVolumes') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-snapshot-move-data"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.snapshotMoveData') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-default-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.defaultVolumesToFsBackup') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-csi-snapshot-timeout"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.csiSnapshotTimeout') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-item-operation-timeout"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.itemOperationTimeout') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-parallel-files-upload"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.parallelFilesUpload') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-data-mover"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.datamover') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { initTooltips } from 'flowbite';
import { useFormNamespaces } from '@velero-ui-app/composables/form/useFormNamespaces';
import { useFormStorageLocations } from '@velero-ui-app/composables/form/useFormStorageLocations';
import { useFormSnapshotLocations } from '@velero-ui-app/composables/form/useFormSnapshotLocations';
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const { data: dataNamespaces, isError: errorNamespaces } = useFormNamespaces();

const { data: dataStorageLocations, isError: errorStorageLocations } =
  useFormStorageLocations();

const { data: dataSnapshotLocations, isError: errorSnapshotLocations } =
  useFormSnapshotLocations();

const formContext = useFormKitContextById('backup-form-info');

const currentForm = ref({
  name: '',
  ttl: {
    value: '',
    unit: 'h',
  },
  csiSnapshotTimeout: {
    value: '',
    unit: 'm',
  },
  itemOperationTimeout: {
    value: '',
    unit: 'h',
  },
  includedNamespaces: [],
  excludedNamespaces: [],
  volumeSnapshotLocations: [],
  storageLocation: '',
  snapshotVolumes: false,
  snapshotMoveData: false,
  defaultVolumesToFsBackup: false,
  datamover: '',
  parallelFilesUpload: '',
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () => formContext.value.state.valid;

const getForm = () => formContext.value.value;

defineExpose({
  validate,
  getForm,
});
</script>
