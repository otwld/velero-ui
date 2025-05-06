<template>
  <FormKit
    id="snapshot-location-form-info"
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
            <template #label="context">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >{{ t('form.field.volumeSnapshotLocationName') }} *</label
              >
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
            <template #label="context">
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
      </div>
    </div>
  </FormKit>
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
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const formContext = useFormKitContextById('snapshot-location-form-info');

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

const validate = () => formContext.value.state.valid;

const getForm = () => formContext.value.value;

defineExpose({
  validate,
  getForm,
});
</script>
