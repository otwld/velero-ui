<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="name"
            >{{ t('form.field.backupName') }} *</label
          >
          <FormKit
            id="name"
            v-model="currentForm.name"
            :disabled="notApplicableFields?.backupName"
            :placeholder="
              notApplicableFields?.backupName
                ? t('form.placeholder.notApplicable')
                : t('form.placeholder.backupName')
            "
            :validation="[
              ['required'],
              ['matches', /[a-zA-Z0-9.-]+/g],
              ['length', 5],
            ]"
            :validation-messages="{
              matches: 'Name can only include A-z, 0-9, and -.',
              length: 'Min length is 5 characters.',
            }"
            input-class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            messages-class="mt-1 text-sm text-red-600 dark:text-red-500"
            name="Name"
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="ttl"
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
            <input
              id="ttl"
              v-model="currentForm.ttl"
              class="p-2.5 w-2/6 flex-shrink-0 rounded-none text-sm rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="0"
              required
              type="number"
              value="0"
            />
            <select
              id="ttl-unit"
              v-model="currentForm.ttlUnit"
              class="p-2.5 w-4/6 text-sm bg-gray-50 border border-s-0 border-gray-300 text-gray-900 rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="backup-sync-period-unit"
              required
            >
              <option selected value="s">{{ t('global.seconds') }}</option>
              <option value="m">{{ t('global.minutes') }}</option>
              <option value="h">{{ t('global.hours') }}</option>
            </select>
          </div>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="included-namespace"
            >{{ t('resource.spec.includedNamespaces') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-included-namespace"
            />
          </label>
          <select
            id="included-namespace"
            v-model="currentForm.includedNamespaces"
            :disabled="!dataNamespaces || errorNamespaces"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            multiple
          >
            <template v-if="dataNamespaces?.items">
              <option
                v-for="(namespace, index) of dataNamespaces?.items"
                :key="index"
                :value="namespace"
              >
                {{ namespace }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="excluded-namespace"
            >{{ t('resource.spec.excludedNamespaces') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-excluded-namespace"
            />
          </label>
          <select
            id="excluded-namespace"
            v-model="currentForm.excludedNamespaces"
            :disabled="!dataNamespaces || errorNamespaces"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            multiple
          >
            <template v-if="dataNamespaces?.items">
              <option
                v-for="(namespace, index) of dataNamespaces?.items"
                :key="index"
                :value="namespace"
              >
                {{ namespace }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="snapshot-location"
            >{{ t('resource.spec.volumeSnapshotLocations') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-snapshot-location"
            />
          </label>
          <select
            id="snapshot-location"
            v-model="currentForm.volumeSnapshotLocations"
            :disabled="!dataSnapshotLocations || errorSnapshotLocations"
            class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            multiple
          >
            <template v-if="dataStorageLocations?.items">
              <option
                v-for="(location, index) of dataSnapshotLocations?.items"
                :key="index"
                :value="location"
              >
                {{ location }}
              </option>
            </template>
          </select>
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="storage-location"
            >{{ t('resource.spec.storageLocation') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-storage-location"
            />
          </label>
          <select
            id="storage-location"
            v-model="currentForm.storageLocation"
            :disabled="!dataStorageLocations || errorStorageLocations"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option selected value="">{{ t('form.placeholder.storageLocation') }}</option>
            <template v-if="dataStorageLocations?.items">
              <option
                v-for="(location, index) of dataStorageLocations?.items"
                :key="index"
                :value="location"
              >
                {{ location }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ t('global.options') }}
            </p>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.snapshotVolumes"
                checked
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <span
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              />
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >{{ t('resource.spec.snapshotVolumes') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-snapshot-volumes"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.snapshotMoveData"
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <span
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              />
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >{{ t('resource.spec.snapshotMoveData') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-snapshot-move-data"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.defaultVolumesToFsBackup"
                checked
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >{{ t('resource.spec.defaultVolumesToFsBackup') }}</span
              >
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
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="csi-snapshot-timeout"
            >{{ t('resource.spec.csiSnapshotTimeout') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-csi-snapshot-timeout"
            />
          </label>
          <div class="flex w-full">
            <input
              id="csi-snapshot-timeout"
              v-model="currentForm.csiSnapshotTimeout"
              class="p-2.5 w-2/6 flex-shrink-0 rounded-none text-sm rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="0"
              required
              type="number"
              value="0"
            />
            <select
              id="csi-snapshot-timeout-unit"
              v-model="currentForm.csiSnapshotTimeoutUnit"
              class="p-2.5 w-4/6 text-sm bg-gray-50 border border-s-0 border-gray-300 text-gray-900 rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="csi-snapshot-timeout-unit"
              required
            >
              <option selected value="s">{{ t('global.seconds') }}</option>
              <option value="m">{{ t('global.minutes') }}</option>
              <option value="h">{{ t('global.hours') }}</option>
            </select>
          </div>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="item-operation-timeout"
            >{{ t('resource.spec.itemOperationTimeout') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-item-operation-timeout"
            />
          </label>
          <div class="flex w-full">
            <input
              id="item-operation-timeout"
              v-model="currentForm.itemOperationTimeout"
              class="p-2.5 w-2/6 flex-shrink-0 rounded-none text-sm rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="0"
              required
              type="number"
              value="0"
            />
            <select
              id="item-operation-timeout-unit"
              v-model="currentForm.itemOperationTimeoutUnit"
              class="p-2.5 w-4/6 text-sm bg-gray-50 border border-s-0 border-gray-300 text-gray-900 rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="item-operation-timeout-unit"
              required
            >
              <option selected value="s">{{ t('global.seconds') }}</option>
              <option value="m">{{ t('global.minutes') }}</option>
              <option value="h">{{ t('global.hours') }}</option>
            </select>
          </div>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="data-mover"
            >{{ t('resource.spec.datamover') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-data-mover"
            />
          </label>
          <input
            id="data-mover"
            v-model="currentForm.datamover"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="prefix"
            :placeholder="t('form.placeholder.datamover')"
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="parallel-files-upload"
            >{{ t('resource.spec.parallelFilesUpload') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-parallel-files-upload"
            />
          </label>
          <input
            id="parallel-files-upload"
            v-model="currentForm.parallelFilesUpload"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="prefix"
            type="number"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    id="tooltip-ttl"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.ttl')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-included-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedNamespaces', {type: t('global.backup', 1)})}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedNamespaces', {type: t('global.backup', 1)})}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-snapshot-location"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.volumeSnapshotLocations')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-storage-location"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.storageLocation')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-snapshot-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.snapshotVolumes')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-snapshot-move-data"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.snapshotMoveData')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-default-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.defaultVolumesToFsBackup')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-csi-snapshot-timeout"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.csiSnapshotTimeout')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-item-operation-timeout"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.itemOperationTimeout')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-parallel-files-upload"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.parallelFilesUpload')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-data-mover"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.datamover')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
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

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const { data: dataNamespaces, isError: errorNamespaces } = useFormNamespaces();

const { data: dataStorageLocations, isError: errorStorageLocations } =
  useFormStorageLocations();

const { data: dataSnapshotLocations, isError: errorSnapshotLocations } =
  useFormSnapshotLocations();

const currentForm = ref({
  name: '',
  ttl: '72',
  ttlUnit: 'h',
  includedNamespaces: [],
  excludedNamespaces: [],
  volumeSnapshotLocations: [],
  storageLocation: '',
  snapshotVolumes: false,
  snapshotMoveData: false,
  defaultVolumesToFsBackup: false,
  itemOperationTimeout: '4',
  itemOperationTimeoutUnit: 'h',
  csiSnapshotTimeout: '10',
  csiSnapshotTimeoutUnit: 'm',
  datamover: '',
  parallelFilesUpload: 10,
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () =>
  !!(
    (notApplicableFields.value?.backupName ? true : currentForm.value?.name) &&
    currentForm.value?.ttl &&
    currentForm.value?.storageLocation
  );

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
