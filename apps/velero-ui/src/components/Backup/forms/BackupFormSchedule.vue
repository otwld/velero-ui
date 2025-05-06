<template>
  <FormKit
    id="backup-form-schedule"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div class="col-span-2">
        <FormKit
          :placeholder="t('form.placeholder.backupName')"
          :validation="[['required'], ['k8s_name'], ['length', 4]]"
          name="name"
          type="text"
        >
          <template #label="context">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('form.field.backupName') }} *
            </label>
          </template>
        </FormKit>
      </div>
      <div class="col-span-2">
        <FormKit
          :disabled="!data || !!isError"
          :label="t('resource.spec.volumeSnapshotLocations')"
          :options="data?.items"
          :placeholder="t('form.placeholder.schedule')"
          :validation="[['required']]"
          name="schedule"
          outer-class="mb-2"
          type="select"
        >
          <template #label="context">
            <label
              class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
              >{{ t('form.field.schedule') }} *
            </label>
          </template>
        </FormKit>
      </div>
    </div>
  </FormKit>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { useFormSchedules } from '@velero-ui-app/composables/form/useFormSchedules';
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();

const { data, isError } = useFormSchedules();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const formContext = useFormKitContextById('backup-form-schedule');

const currentForm = ref({
  name: '',
  schedule: '',
});

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validateName = computed(() => {
  return !!(
    currentForm.value.name &&
    currentForm.value.name.length > 4 &&
    /[a-zA-Z0-9.-]+/g.test(currentForm.value.name)
  );
});

const validate = () => formContext.value.state.valid;

const getForm = () => formContext.value.value;

defineExpose({
  validate,
  getForm,
});
</script>
