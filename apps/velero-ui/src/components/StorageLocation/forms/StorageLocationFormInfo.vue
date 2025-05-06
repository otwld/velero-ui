<template>
  <FormKit
    id="storage-location-form-info"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :disabled="notApplicableFields?.name"
            :placeholder="t('form.placeholder.storageLocationName')"
            :validation="[['required'], ['k8s_name'], ['length', 4]]"
            name="name"
            type="text"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('form.field.backupStorageLocationName') }} *
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :options="['ReadWrite', 'ReadOnly']"
            :placeholder="t('form.placeholder.accessMode')"
            :validation="[['required']]"
            name="accessMode"
            type="select"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.accessMode') }} *
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-access-mode"
                />
              </label>
            </template>
          </FormKit>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :placeholder="t('form.placeholder.bucket')"
            :validation="[['required'], ['bucket'], ['length', 2]]"
            name="bucket"
            type="text"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.bucket') }} *
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-bucket-name"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :placeholder="t('form.placeholder.prefix')"
            :validation="[['field']]"
            name="prefix"
            type="text"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.prefix') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-prefix"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :placeholder="t('form.placeholder.provider')"
            :validation="[['required'], ['matches', /[a-zA-Z0-9-]+/g]]"
            name="provider"
            type="text"
          >
            <template #label>
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('resource.spec.provider') }} *
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-provider"
                />
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit name="backupSyncPeriod" type="group">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              for="backup-sync-period"
            >{{ t('resource.spec.backupSyncPeriod') }}
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-backup-sync-period"
              />
            </label>
            <div class="flex w-full">
              <FormKit
                :placeholder="t('form.placeholder.backupSyncPeriod')"
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
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="certificate"
          >{{ t('resource.spec.certificate') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-certificate"
            />
          </label>
          <input
            id="certificate"
            accept=".pem,.crt,.cer,.key"
            aria-describedby="certificate-help"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            size="4194304"
            type="file"
            @change="onFileChanged($event)"
          >
          <p
            id="certificate-help"
            class="mt-1 text-xs text-gray-500 dark:text-gray-300"
          >
            .PEM, .CRT, .CER or .KEY (MAX. 2mo).
          </p>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit name="validationFrequency" type="group">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t('resource.spec.validationFrequency') }}
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-validation-frequency"
              />
            </label>
            <div class="flex w-full">
              <FormKit
                :placeholder="t('form.placeholder.validationFrequency')"
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
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ t('global.labels') }}
            </p>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <FormKit
                name="default"
                type="checkbox"
                input-class="sr-only peer"
                label-class="ml-2"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                outer-class="flex items-center"
              >
                <template #decorator>
                  <span
                    class="peer
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-white after:content-['']
                      after:absolute after:top-0.5 after:start-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600
                      peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>

              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
              >{{ t('resource.spec.default') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-set-default"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </FormKit>

  <div
    id="tooltip-access-mode"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.accessMode') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-bucket-name"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.bucket') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-prefix"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.prefix') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-provider"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.provider') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-backup-sync-period"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.backupSyncPeriod') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-validation-frequency"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.validationFrequency') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-certificate"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.certificate') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-set-default"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.default') }}
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
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const formContext = useFormKitContextById('storage-location-form-info');

const currentForm = ref({
  name: '',
  accessMode: '',
  bucket: '',
  prefix: '',
  provider: '',
  caCert: null,
  default: false,
  backupSyncPeriod: {
    value: '',
    unit: 'm'
  },
  validationFrequency: {
    value: '',
    unit: 'm'
  },
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
  currentForm.value.caCert = null;
});

const onFileChanged = (event) => {
  console.log(currentForm.value.caCert);

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    currentForm.value.caCert = e.target.result;
  };
  reader.readAsText(file);
  console.log(file);
};

const validate = () => formContext.value.state.valid;

const getForm = () => formContext.value.value;

defineExpose({
  validate,
  getForm,
});
</script>
