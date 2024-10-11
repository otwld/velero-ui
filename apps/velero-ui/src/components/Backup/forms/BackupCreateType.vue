<template>
  <div>
    <p class="text-gray-900 dark:text-white mb-4">Type of backup:</p>
    <ul class="space-y-4 mb-4">
      <li>
        <input
          id="template"
          v-model="currentForm.type"
          class="hidden peer"
          name="type"
          required
          type="radio"
          value="template"
        />
        <label
          class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
          for="template"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">From a schedule</div>
            <div class="w-full text-gray-500 dark:text-gray-400">
              Use a existing schedule as template
            </div>
          </div>
          <FontAwesomeIcon
            :icon="faArrowRightLong"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
          />
        </label>
      </li>
      <li>
        <input
          id="custom"
          v-model="currentForm.type"
          class="hidden peer"
          name="type"
          type="radio"
          value="custom"
        />
        <label
          class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
          for="custom"
        >
          <div class="block">
            <div class="text-lg font-semibold">From scratch</div>
            <div class="text-gray-500 dark:text-gray-400">
              Create your own template
            </div>
          </div>
          <FontAwesomeIcon
            :icon="faArrowRightLong"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
          />
        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const currentForm = ref({
  type: '',
});

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () => !!currentForm.value?.type;

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
