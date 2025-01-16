<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="name"
          >{{ t('form.field.restoreName')}} *</label
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
          :placeholder="t('form.placeholder.restoreName')"
          required
          type="text"
        />
      </div>
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="schedule"
          >{{ t('resource.spec.backup')}} *</label
        >
        <FormKit
          id="backup"
          v-model="currentForm.backupName"
          :disabled="!data || !!isError || notApplicableFields?.backupName"
          :validation="[['required']]"
          input-class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          messages-class="mt-1 text-sm text-red-600 dark:text-red-500"
          name="backup"
          required
          type="select"
        >
          <option value="">{{ t('form.placeholder.backup')}}</option>
          <option
            v-if="notApplicableFields?.backupName"
            :value="currentForm.backupName"
          >
            {{ currentForm.backupName }}
          </option>
          <template v-if="data?.items && !notApplicableFields?.backupName">
            <option
              v-for="(backup, index) of data?.items"
              :key="index"
              :value="backup"
            >
              {{ backup }}
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
import { useFormBackups } from '@velero-ui-app/composables/form/useFormBackups';
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const { data, isError } = useFormBackups();

const formStore = useFormStore();
const { currentStep, formContent, notApplicableFields } =
  storeToRefs(formStore);

const currentForm = ref({
  name: '',
  backupName: '',
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
  return !!(validateName.value && currentForm.value?.backupName);
};

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
