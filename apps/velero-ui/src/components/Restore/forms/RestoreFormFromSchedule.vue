<template>
  <FormKit
    id="restore-form-from-schedule"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div class="col-span-2">
        <FormKit
          :placeholder="t('form.placeholder.restoreName')"
          :validation="[['required'], ['k8s_name'], ['length', 4]]"
          name="name"
          type="text"
        >
          <template #label>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >{{ t('form.field.restoreName') }} *</label>
          </template>
        </FormKit>
      </div>
      <div class="col-span-2">
        <FormKit
          :disabled="!data || !!isError"
          :label="t('resource.spec.schedule')"
          :options="data?.items"
          :placeholder="t('form.placeholder.schedule')"
          :validation="[['required']]"
          name="scheduleName"
          outer-class="mb-2"
          type="select"
        >
          <template #label>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >{{ t('resource.spec.schedule') }} *</label>
          </template>
        </FormKit>
      </div>
    </div>
  </FormKit>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { useFormSchedules } from '@velero-ui-app/composables/form/useFormSchedules';
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const { data, isError } = useFormSchedules();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const formContext = useFormKitContextById('restore-form-from-schedule');

const currentForm = ref({
  name: '',
  scheduleName: '',
});

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
