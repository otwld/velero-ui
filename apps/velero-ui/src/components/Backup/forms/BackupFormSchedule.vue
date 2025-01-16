<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="name"
          >{{ t('form.field.backupName') }} *</label
        >
        <FormKit
          id="name"
          v-model="currentForm.name"
          :validation="[
            ['required'],
            ['matches', /[a-zA-Z0-9.-]+/g],
            ['length', 5],
          ]"
          :validation-messages="{
            matches: 'Name can only include A-z, 0-9, and -.',
            length: 'Minimun length is 5 characters.',
          }"
          input-class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          messages-class="mt-1 text-sm text-red-600 dark:text-red-500"
          name="name"
          :placeholder="t('form.placeholder.backupName')"
          required
          type="text"
        />
      </div>
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="schedule"
          >{{ t('form.field.schedule') }} *</label
        >
        <FormKit
          id="schedule"
          v-model="currentForm.schedule"
          :disabled="!data || !!isError"
          :validation="[['required']]"
          input-class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          messages-class="mt-1 text-sm text-red-600 dark:text-red-500"
          name="schedule"
          required
          type="select"
        >
          <option value="">{{ t('form.placeholder.schedule') }}</option>
          <template v-if="data?.items">
            <option
              v-for="(schedule, index) of data?.items"
              :key="index"
              :value="schedule"
            >
              {{ schedule }}
            </option>
          </template>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { useFormSchedules } from '@velero-ui-app/composables/form/useFormSchedules';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { data, isError } = useFormSchedules();

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

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

const validate = () => {
  return !!(validateName.value && currentForm.value?.schedule);
};

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
