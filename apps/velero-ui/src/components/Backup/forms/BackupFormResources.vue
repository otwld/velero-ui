<template>
  <div>
    <div
      class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
      role="alert"
    >
      <FontAwesomeIcon
        :icon="faInfoCircle"
        class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
      />
      <span class="sr-only">Info</span>
      <div>
        <span class="font-medium">About resources:</span>
        <ul class="mt-1.5 list-disc list-inside">
          <li>
            User could use the include and exclude with the velero backup. And
            user could also use resource policies to handle backup. By default,
            Velero includes all objects in a backup when no filtering options
            are used.
          </li>
        </ul>
        <a
          href="https://velero.io/docs/latest/resource-filtering/"
          target="_blank"
        >
          <button
            class="text-white mt-2 bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            <FontAwesomeIcon
              :icon="faArrowUpRightFromSquare"
              class="me-2 h-3 w-3"
            />
            {{ t('global.button.learnMore.title')}}
          </button>
        </a>
      </div>
    </div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="resource-policies-configmap"
            >{{ t('resource.spec.resourcePolicy') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-resource-policies-configmap"
            />
          </label>
          <select
            id="resource-policies-configmap"
            v-model="currentForm.resourcePolicy"
            :disabled="!data || isError"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option selected value="">{{ t('form.placeholder.resourcePolicy') }}</option>
            <template v-if="data?.items">
              <option
                v-for="(cm, index) of data?.items"
                :key="index"
                :value="cm"
              >
                {{ cm }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ t('global.options')}}
            </p>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.includeClusterResources"
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
                >{{ t('resource.spec.includeClusterResources') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-include-cluster-resources"
              />
            </label>
          </div>
        </div>
      </div>
      <div
        :class="{ hidden: !currentForm.includeClusterResources }"
        class="grid gap-4 mb-4 grid-cols-1"
      >
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="included-resources"
            >{{ t('resource.spec.includedResources') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-included-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <input
              id="included-resources"
              v-model="form.includedResources"
              class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              name="included-resources"
              :placeholder="t('form.placeholder.resource')"
              required
              type="text"
              v-on:keyup.enter="add('includedResources')"
            />
            <button
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              :title="t('global.button.add.title')"
              @click="add('includedResources')"
            >
              <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
            </button>
          </div>
          <span
            v-for="(resource, index) of currentForm.includedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              :title="t('global.button.delete.title')"
              @click="remove('includedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="w-2 h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="excluded-resources"
            >{{ t('resource.spec.excludedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-excluded-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <input
              id="excluded-resources"
              v-model="form.excludedResources"
              class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              name="excluded-resources"
              :placeholder="t('form.placeholder.resource')"
              required
              type="text"
              v-on:keyup.enter="add('excludedResources')"
            />
            <button
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              :title="t('global.button.add.title')"
              @click="add('excludedResources')"
            >
              <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
            </button>
          </div>
          <span
            v-for="(resource, index) of currentForm.excludedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              :title="t('global.button.delete.title')"
              @click="remove('excludedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="w-2 h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
      </div>
      <div
        :class="{ hidden: currentForm.includeClusterResources }"
        class="grid gap-4 mb-4 grid-cols-1"
      >
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="include-cluster-scoped-resources"
            >{{ t('resource.spec.includedClusterScopedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-include-cluster-scoped-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <input
              id="include-cluster-scoped-resources"
              v-model="form.includedClusterScopedResources"
              class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              name="include-cluster-scoped-resources"
              :placeholder="t('form.placeholder.resource')"
              required
              type="text"
              v-on:keyup.enter="add('includedClusterScopedResources')"
            />
            <button
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              :title="t('global.button.add.title')"
              @click="add('includedClusterScopedResources')"
            >
              <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
            </button>
          </div>
          <span
            v-for="(
              resource, index
            ) of currentForm.includedClusterScopedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              :title="t('global.button.delete.title')"
              @click="remove('includedClusterScopedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="w-2 h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="exclude-cluster-scoped-resources"
            >{{ t('resource.spec.excludedClusterScopedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-exclude-cluster-scoped-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <input
              id="exclude-cluster-scoped-resources"
              v-model="form.excludedClusterScopedResources"
              class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              name="exclude-cluster-scoped-resources"
              :placeholder="t('form.placeholder.resource')"
              required
              type="text"
              v-on:keyup.enter="add('excludedClusterScopedResources')"
            />
            <button
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              :title="t('global.button.add.title')"
              @click="add('excludedClusterScopedResources')"
            >
              <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
            </button>
          </div>
          <span
            v-for="(
              resource, index
            ) of currentForm.excludedClusterScopedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              :title="t('global.button.delete.title')"
              @click="remove('excludedClusterScopedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="w-2 h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="include-namespace-scoped-resources"
            >{{ t('resource.spec.includedNamespaceScopedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-include-namespace-scoped-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <input
              id="include-namespace-scoped-resources"
              v-model="form.includedNamespaceScopedResources"
              class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              name="include-namespace-scoped-resources"
              :placeholder="t('form.placeholder.resource')"
              required
              type="text"
              v-on:keyup.enter="add('includedNamespaceScopedResources')"
            />
            <button
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              :title="t('global.button.add.title')"
              @click="add('includedNamespaceScopedResources')"
            >
              <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
            </button>
          </div>
          <span
            v-for="(
              resource, index
            ) of currentForm.includedNamespaceScopedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              :title="t('global.button.delete.title')"
              @click="remove('includedNamespaceScopedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="w-2 h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="exclude-namespace-scoped-resources"
            >{{ t('resource.spec.excludedNamespaceScopedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-exclude-namespace-scoped-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <input
              id="exclude-namespace-scoped-resources"
              v-model="form.excludedNamespaceScopedResources"
              class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              name="exclude-namespace-scoped-resources"
              :placeholder="t('form.placeholder.resource')"
              required
              type="text"
              v-on:keyup.enter="add('excludedNamespaceScopedResources')"
            />
            <button
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              :title="t('global.button.add.title')"
              @click="add('excludedNamespaceScopedResources')"
            >
              <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
            </button>
          </div>
          <span
            v-for="(
              resource, index
            ) of currentForm.excludedNamespaceScopedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              :title="t('global.button.delete.title')"
              @click="remove('excludedNamespaceScopedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="w-2 h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div
    id="tooltip-include-cluster-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includeClusterResources',  {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-resource-policies-configmap"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.resourcePolicy') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-included-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedResources', {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedResources', {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-exclude-cluster-scoped-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedClusterScopedResources', {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-include-cluster-scoped-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedClusterScopedResources', {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-include-namespace-scoped-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedNamespaceScopedResources', {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-exclude-namespace-scoped-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedNamespaceScopedResources', {type: t('global.backup', 1)}) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faInfoCircle,
  faPlus,
  faQuestionCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { initTooltips } from 'flowbite';
import { useFormConfigMaps } from '@velero-ui-app/composables/form/useFormConfigMaps';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const { data, isError } = useFormConfigMaps();

const currentForm = ref({
  includeClusterResources: true,
  resourcePolicy: '',
  includedResources: ['*'],
  excludedResources: [],
  includedClusterScopedResources: [],
  excludedClusterScopedResources: [],
  includedNamespaceScopedResources: [],
  excludedNamespaceScopedResources: [],
});

const form = ref({
  includedResources: '',
  excludedResources: '',
  includedClusterScopedResources: '',
  excludedClusterScopedResources: '',
  includedNamespaceScopedResources: '',
  excludedNamespaceScopedResources: '',
});

onMounted(() => initTooltips());

watch(currentForm, () => initTooltips(), { deep: true });

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const add = (type: string) => {
  if (
    form.value[type] &&
    !currentForm.value[type].find((r) => r === form.value[type])
  ) {
    currentForm.value[type].push(form.value[type]);
    form.value[type] = '';
  }
};

const remove = (type: string, resource: string) => {
  currentForm.value[type] = currentForm.value[type].filter(
    (r: string) => r !== resource,
  );
};

const validate = () =>
  currentForm.value.includeClusterResources
    ? currentForm.value?.includedResources.length > 0
    : true;

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
