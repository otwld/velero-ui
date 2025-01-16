<template>
  <div>
    <div class="flex justify-center">
      <label class="inline-flex items-center cursor-pointer">
        <span class="me-3 font-medium text-gray-900 dark:text-gray-300">{{
          t('resource.spec.labelSelector')
        }}</span>
        <input
          v-model="currentForm.isOrLabelSelector"
          class="sr-only peer"
          type="checkbox"
          value=""
        />
        <div
          class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        />
        <span class="ms-3 font-medium text-gray-900 dark:text-gray-300">{{
          t('resource.spec.orLabelSelectors')
        }}</span>
      </label>
    </div>
    <div
      :class="{ hidden: currentForm.isOrLabelSelector }"
      class="space-y-4 my-4"
    >
      <label
        class="block text-sm font-medium text-gray-900 dark:text-white"
        for="name"
        >{{ t('resource.spec.labelSelector') }}
        <FontAwesomeIcon
          :icon="faQuestionCircle"
          class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
          data-tooltip-style="light"
          data-tooltip-target="tooltip-selector"
        />
      </label>
      <div>
        <div class="inline-flex w-full">
          <input
            id="config-keyConfig"
            v-model="keyLabelSelector"
            class="flex-shrink-0 p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 rounded-s-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            minlength="5"
            :placeholder="t('global.key')"
            required
            type="text"
          />
          <input
            id="config-value"
            v-model="valueLabelSelector"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            minlength="5"
            :placeholder="t('global.value')"
            required
            type="text"
          />
          <button
            class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            :title="t('global.button.add.title')"
            @click="addNewLabelSelector()"
          >
            <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
          </button>
        </div>
        <p class="pt-2 text-sm text-red-600 dark:text-red-500">
          {{ errorLabelSelector }}
        </p>
      </div>
      <div
        v-if="Object.entries(currentForm.labelsSelector).length > 0"
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
              v-for="(c, index) in Object.entries(currentForm.labelsSelector)"
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
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                  :title="t('global.button.delete.title')"
                  type="button"
                  @click="removeLabelSelector(c[0])"
                >
                  <FontAwesomeIcon :icon="faTrashCan" class="w-3 h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      :class="{ hidden: !currentForm.isOrLabelSelector }"
      class="space-y-4 my-4"
    >
      <div
        class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
        role="alert"
      >
        <FontAwesomeIcon
          :icon="faInfoCircle"
          class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
        />
        <p>{{ t('form.message.error.orLabelSelectors')}}</p>
      </div>
    </div>
    <div class="space-y-4 my-4">
      <label
        class="block text-sm font-medium text-gray-900 dark:text-white"
        for="name"
        >{{ t('resource.metadata.labels') }}
        <FontAwesomeIcon
          :icon="faQuestionCircle"
          class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
          data-tooltip-style="light"
          data-tooltip-target="tooltip-labels"
        />
      </label>
      <div>
        <div class="inline-flex w-full">
          <input
            id="config-keyConfig"
            v-model="keyLabel"
            class="flex-shrink-0 p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 rounded-s-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            minlength="5"
            :placeholder="t('global.key')"
            required
            type="text"
          />
          <input
            id="config-value"
            v-model="valueLabel"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            minlength="5"
            :placeholder="t('global.value')"
            required
            type="text"
          />
          <button
            class="top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            :title="t('global.button.add.title')"
            @click="addNewLabel()"
          >
            <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
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
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                  :title="t('global.button.delete.title')"
                  type="button"
                  @click="removeLabel(c[0])"
                >
                  <FontAwesomeIcon :icon="faTrashCan" class="w-3 h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div
    id="tooltip-selector"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.labelSelector')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-or-selector"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.labelSelector')}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-labels"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.labels', {type: t('global.backup', 1)})}}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { initTooltips } from 'flowbite';
import {
  faInfoCircle,
  faPlus,
  faQuestionCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const currentForm = ref({
  isOrLabelSelector: false,
  labels: {},
  labelsSelector: {},
  orLabelsSelectors: [],
});

const keyLabel = ref('');
const valueLabel = ref('');
const errorLabel = ref('');

const keyLabelSelector = ref('');
const valueLabelSelector = ref('');
const errorLabelSelector = ref('');

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const addNewLabel = () => {
  if (keyLabel.value in currentForm.value.labels) {
    errorLabel.value = 'Key is already defined!';
    return;
  }
  if (!keyLabel.value || !valueLabel.value) {
    errorLabel.value = 'Key/value cannot be empty!';
    return;
  }
  currentForm.value.labels[keyLabel.value] = valueLabel.value;
  keyLabel.value = '';
  valueLabel.value = '';
  errorLabel.value = '';
};

const removeLabel = (key: string) => {
  delete currentForm.value.labels[key];
};

const addNewLabelSelector = () => {
  if (keyLabelSelector.value in currentForm.value.labelsSelector) {
    errorLabelSelector.value = 'Key is already defined!';
    return;
  }
  if (!keyLabelSelector.value || !valueLabelSelector.value) {
    errorLabelSelector.value = 'Key/value cannot be empty!';
    return;
  }
  currentForm.value.labelsSelector[keyLabelSelector.value] =
    valueLabelSelector.value;
  keyLabelSelector.value = '';
  valueLabelSelector.value = '';
  errorLabelSelector.value = '';
};

const removeLabelSelector = (key: string) => {
  delete currentForm.value.labelsSelector[key];
};

const validate = () => true;

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
