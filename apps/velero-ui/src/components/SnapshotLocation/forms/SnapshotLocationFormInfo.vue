<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="name"
            >{{ t('form.field.volumeSnapshotLocationName') }} *</label
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
      </div>
    </div>
  </div>
  <div
    id="tooltip-provider"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.provider') }}
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
  provider: '',
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () =>
  !!(currentForm.value?.name && currentForm.value?.provider);

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
