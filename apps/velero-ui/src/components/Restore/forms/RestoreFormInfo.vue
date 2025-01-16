<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="included-namespace"
            >{{ t('resource.spec.includedNamespaces') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
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
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
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
            for="item-operation-timeout"
            >{{ t('resource.spec.itemOperationTimeout') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-item-operation-timeout"
            />
          </label>
          <div class="flex w-full mb-2">
            <input
              id="item-operation-timeout"
              v-model="currentForm.itemOperationTimeout"
              class="p-2 w-2/6 flex-shrink-0 rounded-none text-sm rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="0"
              required
              type="number"
              value="0"
            />
            <select
              id="item-operation-timeout-unit"
              v-model="currentForm.itemOperationTimeoutUnit"
              class="p-2 w-4/6 bg-gray-50 border border-s-0 border-gray-300 text-gray-900 rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="item-operation-timeout-unit"
              required
            >
              <option selected value="s">{{ t('global.seconds') }}</option>
              <option value="m">{{ t('global.minutes') }}</option>
              <option value="h">{{ t('global.hours') }}</option>
            </select>
          </div>
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="parallel-files-download"
            >{{ t('resource.spec.parallelFilesDownload') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-parallel-files-download"
            />
          </label>
          <input
            id="parallel-files-download"
            v-model="currentForm.parallelFilesDownload"
            class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="prefix"
            type="number"
          />
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="existing-resource-policy"
            >{{ t('resource.spec.existingResourcePolicy') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-existing-resource-policy"
            />
          </label>
          <select
            id="existing-resource-policy"
            v-model="currentForm.existingResourcePolicy"
            class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option value="none">none</option>
            <option value="update">update</option>
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
                v-model="currentForm.includeClusterResources"
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
                >{{ t('resource.spec.includeClusterResources') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-include-cluster-resources"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.restorePVs"
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
                >{{ t('resource.spec.restorePVs') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-restore-volumes"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.preserveNodePorts"
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
                >{{ t('resource.spec.preserveNodePorts') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-preserve-nodeports"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.writeSparseFiles"
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
                >{{ t('resource.spec.writeSparseFiles') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-write-sparse-files"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    id="tooltip-included-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedNamespaces', {type: t('global.restore', 1)})}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedNamespaces', {type: t('global.restore', 1)})}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-include-cluster-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includeClusterResources',  {type: t('global.restore', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-write-sparse-files"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.writeSparseFiles')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-restore-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.restorePVs')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-preserve-nodeports"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.preserveNodePorts')}}
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
    id="tooltip-parallel-files-download"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.parallelFilesDownload')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-existing-resource-policy"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.existingResourcePolicy')}}
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
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent } =
  storeToRefs(formStore);

const { data: dataNamespaces, isError: errorNamespaces } = useFormNamespaces();

const currentForm = ref({
  name: '',
  includedNamespaces: [],
  excludedNamespaces: [],
  writeSparseFiles: true,
  includeClusterResources: true,
  restorePVs: true,
  preserveNodePorts: true,
  itemOperationTimeout: 4,
  itemOperationTimeoutUnit: 'h',
  parallelFilesDownload: 10,
  existingResourcePolicy: 'none',
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () => true;

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
