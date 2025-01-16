<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="name"
            >{{ t('form.field.backupStorageLocationName') }} *</label
          >
          <FormKit
            id="name"
            v-model="currentForm.name"
            :disabled="notApplicableFields?.name"
            :placeholder="t('form.placeholder.storageLocationName')"
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
            required
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="access-mode"
            >{{ t('resource.spec.accessMode') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-access-mode"
            />
          </label>
          <select
            id="access-mode"
            v-model="currentForm.accessMode"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option selected value="">
              {{ t('form.placeholder.accessMode') }}
            </option>
            <option selected value="ReadWrite">ReadWrite</option>
            <option selected value="ReadOnly">ReadOnly</option>
          </select>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="bucket-name"
            >{{ t('resource.spec.bucket') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-bucket-name"
            />
          </label>
          <input
            id="bucket-name"
            v-model="currentForm.bucket"
            :placeholder="t('form.placeholder.bucket')"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="bucket-name"
            required
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="prefix"
            >{{ t('resource.spec.prefix') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-prefix"
            />
          </label>
          <input
            id="prefix"
            v-model="currentForm.prefix"
            :placeholder="t('form.placeholder.prefix')"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="prefix"
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="provider"
            >{{ t('resource.spec.provider') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-provider"
            />
          </label>
          <input
            id="provider"
            v-model="currentForm.provider"
            :placeholder="t('form.placeholder.provider')"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="provider"
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="backup-sync-period"
            >{{ t('resource.spec.backupSyncPeriod') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-backup-sync-period"
            />
          </label>
          <div class="flex w-full">
            <input
              id="backup-sync-period"
              v-model="currentForm.backupSyncPeriod"
              class="w-2/6 text-sm flex-shrink-0 rounded-none rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="0"
              required
              type="number"
              value="0"
            />
            <select
              id="backup-sync-period-unit"
              v-model="currentForm.backupSyncPeriodUnit"
              class="w-4/6 bg-gray-50 border border-s-0 border-gray-300 text-gray-900 rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            for="certificate"
            >{{ t('resource.spec.certificate') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-certificate"
            />
          </label>
          <input
            id="certificate"
            accept=".pem,.crt,.cer,.key"
            aria-describedby="certificate-help"
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            size="4194304"
            type="file"
            @change="onFileChanged($event)"
          />
          <p
            id="certificate-help"
            class="mt-1 text-xs text-gray-500 dark:text-gray-300"
          >
            .PEM, .CRT, .CER or .KEY (MAX. 2mo).
          </p>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="validation-frequency"
            >{{ t('resource.spec.validationFrequency') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-validation-frequency"
            />
          </label>
          <div class="flex w-full">
            <input
              id="validation-frequency"
              v-model="currentForm.validationFrequency"
              class="p-2 w-2/6 flex-shrink-0 rounded-none text-sm rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="0"
              required
              type="number"
              value="0"
            />
            <select
              id="validation-frequency-unit"
              v-model="currentForm.validationFrequencyUnit"
              class="p-2 w-4/6 bg-gray-50 border border-s-0 border-gray-300 text-gray-900 rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ t('global.labels') }}
            </p>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.default"
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
                >{{ t('resource.spec.default') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-set-default"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    id="tooltip-access-mode"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.accessMode') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-bucket-name"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.bucket') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-prefix"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.prefix') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-provider"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.provider') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-backup-sync-period"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.backupSyncPeriod') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-validation-frequency"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.validationFrequency') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-certificate"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.certificate') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-set-default"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.default') }}
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const currentForm = ref({
  name: '',
  accessMode: 'ReadWrite',
  bucket: '',
  prefix: '',
  provider: '',
  caCert: null,
  default: false,
  backupSyncPeriod: '1',
  backupSyncPeriodUnit: 'm',
  validationFrequency: '1',
  validationFrequencyUnit: 'm',
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
  currentForm.value.caCert = null;
});

const onFileChanged = ($event) => {
  if ($event.target.files[0] !== null) {
    currentForm.value.caCert = $event.target.files[0];
  }
};

const validate = () =>
  !!(
    currentForm.value?.name &&
    currentForm.value?.accessMode &&
    currentForm.value?.bucket &&
    currentForm.value?.provider
  );

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
