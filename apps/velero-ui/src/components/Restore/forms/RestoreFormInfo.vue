<template>
  <FormKit
    id="restore-form-info"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            :disabled="!dataNamespaces || errorNamespaces"
            :options="dataNamespaces?.items"
            multiple
            name="includedNamespaces"
            type="select"
          >
            <template #label="context">
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
            <template #label="context">
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
          <FormKit
            :placeholder="t('form.placeholder.parallelFilesDownload')"
            :validation="[['number'], ['min', 0]]"
            name="parallelFilesDownload"
            outer-class="my-2"
            type="number"
          >
            <template #label="context">
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
                >{{ t('resource.spec.parallelFilesDownload') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-parallel-files-download"
                />
              </label>
            </template>
          </FormKit>
          <FormKit
            :options="{
              '': t('form.placeholder.existingResourcePolicy'),
              none: 'none',
              update: 'update',
            }"
            :placeholder="t('form.placeholder.existingResourcePolicy')"
            name="existingResourcePolicy"
            outer-class="mb-2"
            type="select"
          >
            <template #label="context">
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
                >{{ t('resource.spec.existingResourcePolicy') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-existing-resource-policy"
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
                name="includeClusterResources"
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
                class="ms-3 text-sm font-medium text-gray-400 dark:dark:text-white"
                >{{ t('resource.spec.includeClusterResources') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-include-cluster-resources"
              />
            </label>
            <label class="inline-flex items-center mb-5">
              <FormKit
                name="restorePVs"
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
                >{{ t('resource.spec.restorePVs') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-restore-volumes"
              />
            </label>
            <label class="inline-flex items-center mb-5">
              <FormKit
                name="preserveNodePorts"
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
                class="ms-3 text-sm font-medium text-gray-400 dark:dark:text-white"
                >{{ t('resource.spec.preserveNodePorts') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-preserve-nodeports"
              />
            </label>
            <label class="inline-flex items-center mb-5">
              <FormKit
                name="writeSparseFiles"
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
                class="ms-3 text-sm font-medium text-gray-400 dark:dark:text-white"
                >{{ t('resource.spec.writeSparseFiles') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-write-sparse-files"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </FormKit>

  <div
    id="tooltip-included-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedNamespaces', { type: t('global.restore', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedNamespaces', { type: t('global.restore', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-include-cluster-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{
      t('form.tooltip.includeClusterResources', {
        type: t('global.restore', 1),
      })
    }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-write-sparse-files"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.writeSparseFiles') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-restore-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.restorePVs') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-preserve-nodeports"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.preserveNodePorts') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-item-operation-timeout"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.itemOperationTimeout') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-parallel-files-download"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.parallelFilesDownload') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-existing-resource-policy"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.existingResourcePolicy') }}
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
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const { data: dataNamespaces, isError: errorNamespaces } = useFormNamespaces();

const formContext = useFormKitContextById('restore-form-info');

const currentForm = ref({
  includedNamespaces: [],
  excludedNamespaces: [],
  writeSparseFiles: false,
  includeClusterResources: false,
  restorePVs: false,
  preserveNodePorts: false,
  itemOperationTimeout: {
    value: '',
    unit: 'h',
  },
  parallelFilesDownload: '',
  existingResourcePolicy: '',
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
