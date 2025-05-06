<template>
  <FormKit
    id="restore-form-resources"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div
      class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
      role="alert"
    >
      <FontAwesomeIcon
        :icon="faInfoCircle"
        class="flex-shrink-0 inline !w-4 !h-4 me-3 mt-[2px]"
      />
      <span class="sr-only">Info</span>
      <div>
        <span class="font-medium">About resources:</span>
        <ul class="mt-1.5 list-disc list-inside">
          <li>
            User could use the include and exclude with the velero restore. And
            user could also use resource policies to handle restore. By default,
            Velero includes all objects in a restore when no filtering options
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
            {{ t('global.button.learnMore.title') }}
          </button>
        </a>
      </div>
    </div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-1">
        <div class="col-span-1 sm:col-span-1">
          <FormKit
            :disabled="!data || isError"
            :options="
              [
                { label: t('form.placeholder.resourcePolicy'), value: '' },
              ].concat(data?.items.map((i) => ({ label: i, value: i })))
            "
            :placeholder="t('form.placeholder.resourcePolicy')"
            name="resourceModifier"
            outer-class="mb-2"
            type="select"
          >
            <template #label="context">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >{{ t('resource.spec.resourceModifier') }}
                <FontAwesomeIcon
                  :icon="faQuestionCircle"
                  class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                  data-tooltip-style="light"
                  data-tooltip-target="tooltip-resource-modifier-configmap"
                />
              </label>
            </template>
          </FormKit>
        </div>
      </div>
      <div class="grid gap-4 mb-4 grid-cols-1">
        <div class="col-span-1 sm:col-span-1">

          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="included-resources"
            >{{ t('resource.spec.includedResources') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-included-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <FormKit
              :placeholder="t('form.placeholder.resource')"
              name="includedResource"
              type="text"
              outer-class="w-full mb-2"
              input-class="rounded-s-lg rounded-e-none"
              :validation="[['k8s_resource']]"
              @keyup.enter="add('includedResource')"
              >
            </FormKit>
            <button
              :title="t('global.button.add.title')"
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              @click="add('includedResource')"
            >
              <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4" />
            </button>
          </div>
          <span
            v-for="(resource, index) of currentForm.includedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              :title="t('global.button.delete.title')"
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              @click="remove('includedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="!w-2 !h-2" />
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
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-excluded-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <FormKit
              :placeholder="t('form.placeholder.resource')"
              name="excludedResource"
              type="text"
              outer-class="w-full mb-2"
              input-class="rounded-s-lg rounded-e-none"
              :validation="[['k8s_resource']]"
              @keyup.enter="add('excludedResource')"
              >
            </FormKit>
            <button
              :title="t('global.button.add.title')"
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              @click="add('excludedResource')"
            >
              <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4" />
            </button>
          </div>
          <span
            v-for="(resource, index) of currentForm.excludedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              :title="t('global.button.delete.title')"
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              @click="remove('excludedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="!w-2 !h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="status-include-resources"
            >{{ t('resource.spec.restoreStatusIncludedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-status-include-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <FormKit
              :placeholder="t('form.placeholder.resource')"
              name="statusIncludedResource"
              type="text"
              outer-class="w-full mb-2"
              input-class="rounded-s-lg rounded-e-none"
              :validation="[['k8s_resource']]"
              @keyup.enter="add('statusIncludedResource')"
              >
            </FormKit>
            <button
              :title="t('global.button.add.title')"
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              @click="add('statusIncludedResource')"
            >
              <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4" />
            </button>
          </div>
          <span
            v-for="(resource, index) of currentForm.statusIncludedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              :title="t('global.button.delete.title')"
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              @click="remove('statusIncludedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="!w-2 !h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
        <div class="col-span-1 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="status-exclude-resources"
            >{{ t('resource.spec.restoreStatusExcludedResources') }}
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-status-exclude-resources"
            />
          </label>
          <div class="inline-flex w-full">
            <FormKit
              :placeholder="t('form.placeholder.resource')"
              name="statusExcludedResource"
              type="text"
              outer-class="w-full mb-2"
              input-class="rounded-s-lg rounded-e-none"
              :validation="[['k8s_resource']]"
              @keyup.enter="add('statusExcludedResource')"
              >
            </FormKit>
            <button
              :title="t('global.button.add.title')"
              class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              @click="add('statusExcludedResource')"
            >
              <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4" />
            </button>
          </div>
          <span
            v-for="(resource, index) of currentForm.statusExcludedResources"
            :key="index"
            class="inline-flex items-center px-2 py-1 mb-2 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ resource }}
            <button
              :title="t('global.button.delete.title')"
              aria-label="Remove"
              class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
              type="button"
              @click="remove('statusExcludedResources', resource)"
            >
              <FontAwesomeIcon :icon="faXmark" class="!w-2 !h-2" />
              <span class="sr-only">Remove</span>
            </button>
          </span>
        </div>
      </div>
    </div>
  </FormKit>
  <div
    id="tooltip-resource-modifier-configmap"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.resourceModifier') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-included-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.includedResources', { type: t('global.restore', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.excludedResources', { type: t('global.restore', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-status-exclude-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.restoreStatusExcludedResources') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-status-include-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.restoreStatusIncludedResources') }}
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
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const { data, isError } = useFormConfigMaps();

const formContext = useFormKitContextById('restore-form-resources');

const currentForm = ref({
  resourceModifier: '',
  includedResources: ['*'],
  excludedResources: [],
  statusIncludedResources: [],
  statusExcludedResources: [],

  includedResource: '',
  excludedResource: '',
  statusIncludedResource: '',
  statusExcludedResource: '',
});

const form = ref({
  includedResources: '',
  excludedResources: '',
  statusIncludedResources: '',
  statusExcludedResources: '',
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
  const plural = type.concat('s');
  if (
    formContext.value.node.at(type).context.state.valid &&
    !currentForm.value[plural].find((r) => r === currentForm.value[type])
  ) {
    currentForm.value[plural].push(currentForm.value[type]);
    currentForm.value[type] = '';
  }
};

const remove = (type: string, resource: string) => {
  currentForm.value[type] = currentForm.value[type].filter(
    (r: string) => r !== resource,
  );
};

const validate = () => currentForm.value?.includedResources.length > 0;

const getForm = () => formContext.value.value;

defineExpose({
  validate,
  getForm,
});
</script>
