<template>
  <FormKit
    id="storage-location-form-labels"
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
        <span class="font-medium">About configuration:</span>
        <ul class="mt-1.5 list-disc list-inside">
          <li>
            Provider-specific configuration keyConfigs/values to be passed to
            the object store plugin.
          </li>
        </ul>
        <a
          href="https://velero.io/docs/latest/supported-providers/"
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
            {{ t('form.hint.storageProvider') }}
          </button>
        </a>
      </div>
    </div>
    <div class="space-y-4 my-4">
      <label
        class="block text-sm font-medium text-gray-900 dark:text-white"
        for="name"
        >{{ t('resource.spec.config') }}
        <FontAwesomeIcon
          :icon="faQuestionCircle"
          class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
          data-tooltip-style="light"
          data-tooltip-target="tooltip-config"
        />
      </label>
      <div>
        <div class="inline-flex w-full">
          <FormKit
            :placeholder="t('global.key')"
            :validation="[['field'], ['length', 1]]"
            input-class="rounded-s-lg rounded-s-2 rounded-e-none"
            name="keyConfig"
            outer-class="flex-shrink-0 w-1/2"
            type="text"
          />
          <FormKit
            :placeholder="t('global.value')"
            :validation="[['length', 1]]"
            input-class="rounded-none"
            name="valueConfig"
            outer-class="w-full"
            type="text"
          />
          <button
            :title="t('global.button.add.title')"
            class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            @click="addNewConfig()"
          >
            <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4" />
          </button>
        </div>
        <p class="pt-2 text-sm text-red-600 dark:text-red-500">
          {{ errorConfig }}
        </p>
      </div>
      <div
        v-if="Object.entries(currentForm.configuration).length > 0"
        class="relative overflow-x-auto"
      >
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-6 py-1.5" scope="col">{{ t('global.key') }}</th>
              <th class="px-6 py-1.5" scope="col">{{ t('global.value') }}</th>
              <th class="px-6 py-1.5" scope="col">{{ t('global.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(c, index) in Object.entries(currentForm.configuration)"
              :key="index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                class="px-6 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                scope="row"
              >
                {{ c[0] }}
              </th>
              <td class="px-6 py-1.5">
                {{ c[1] }}
              </td>
              <td class="px-6 py-1.5">
                <button
                  :title="t('global.button.delete.title')"
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                  type="button"
                  @click="removeConfig(c[0])"
                >
                  <FontAwesomeIcon :icon="faTrashCan" class="!w-3 !h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="!notApplicableFields?.labels" class="space-y-4 my-4">
      <label
        class="block text-sm font-medium text-gray-900 dark:text-white"
        for="name"
        >{{ t('resource.metadata.labels') }}
        <FontAwesomeIcon
          :icon="faQuestionCircle"
          class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
          data-tooltip-style="light"
          data-tooltip-target="tooltip-labels"
        />
      </label>
      <div>
        <div class="inline-flex w-full">
          <FormKit
            :placeholder="t('global.key')"
            :validation="[['field'], ['length', 1]]"
            input-class="rounded-s-lg rounded-s-2 rounded-e-none"
            name="keyLabel"
            outer-class="flex-shrink-0 w-1/2"
            type="text"
          />
          <FormKit
            :placeholder="t('global.value')"
            :validation="[['length', 1]]"
            input-class="rounded-none"
            name="valueLabel"
            outer-class="w-full"
            type="text"
          />
          <button
            :title="t('global.button.add.title')"
            class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            @click="addNewLabel()"
          >
            <FontAwesomeIcon :icon="faPlus" class="!w-4 !h-4" />
          </button>
        </div>
        <p class="pt-2 text-sm text-red-600 dark:text-red-500">
          {{ errorLabel }}
        </p>
      </div>
      <div
        v-if="Object.entries(currentForm.labels).length > 0"
        class="relative overflow-x-auto"
      >
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-6 py-1.5" scope="col">{{ t('global.key') }}</th>
              <th class="px-6 py-1.5" scope="col">{{ t('global.value') }}</th>
              <th class="px-6 py-1.5" scope="col">{{ t('global.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(c, index) in Object.entries(currentForm.labels)"
              :key="index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                class="px-6 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                scope="row"
              >
                {{ c[0] }}
              </th>
              <td class="px-6 py-1.5">
                {{ c[1] }}
              </td>
              <td class="px-6 py-1.5">
                <button
                  :title="t('global.button.delete.title')"
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                  type="button"
                  @click="removeLabel(c[0])"
                >
                  <FontAwesomeIcon :icon="faTrashCan" class="!w-3 !h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </FormKit>
  <div
    id="tooltip-config"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.config') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-labels"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.labels', { type: t('global.storageLocation', 1) }) }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { initTooltips } from 'flowbite';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faInfoCircle,
  faPlus,
  faQuestionCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const formContext = useFormKitContextById('storage-location-form-labels');

const currentForm = ref({
  configuration: {},
  labels: {},
});


const errorConfig = ref('');
const errorLabel = ref('');

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const getForm = () => currentForm.value;

const addNewConfig = () => {
  if (
    formContext.value.node.at('keyConfig').context.value in
    currentForm.value.configuration
  ) {
    errorConfig.value = 'Key is already defined!';
    return;
  }
  if (
    !formContext.value.node.at('keyConfig').context.value ||
    !formContext.value.node.at('valueConfig').context.value
  ) {
    errorConfig.value = 'Key/value cannot be empty!';
    return;
  }

  if (
    !formContext.value.node.at('keyConfig').context.state.valid &&
    !formContext.value.node.at('valueConfig').context.state.valid
  ) {
    return;
  }
  currentForm.value.configuration[
    formContext.value.node.at('keyConfig').context.value
  ] = formContext.value.node.at('valueConfig').context.value;
  formContext.value.node.at('keyConfig').input('');
  formContext.value.node.at('valueConfig').input('');
  errorConfig.value = '';
};

const removeConfig = (key: string) => {
  delete currentForm.value.configuration[key];
};

const addNewLabel = () => {
  if (
    formContext.value.node.at('keyLabel').context.value in
    currentForm.value.labels
  ) {
    errorLabel.value = 'Key is already defined!';
    return;
  }
  if (
    !formContext.value.node.at('keyLabel').context.value ||
    !formContext.value.node.at('valueLabel').context.value
  ) {
    errorLabel.value = 'Key/value cannot be empty!';
    return;
  }

  if (
    !formContext.value.node.at('keyLabel').context.state.valid &&
    !formContext.value.node.at('valueLabel').context.state.valid
  ) {
    return;
  }
  currentForm.value.labels[
    formContext.value.node.at('keyLabel').context.value
  ] = formContext.value.node.at('valueLabel').context.value;
  formContext.value.node.at('keyLabel').input('');
  formContext.value.node.at('valueLabel').input('');
  errorLabel.value = '';
};

const removeLabel = (key: string) => {
  delete currentForm.value.labels[key];
};

const validate = (key: string) => true;

defineExpose({
  validate,
  getForm,
});
</script>
