<template>
  <div>
    <ol
      v-if="totalSteps > 1"
      class="flex pb-4 items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
    >
      <template v-for="(step, index) of stepComponents">
        <li
          v-if="index + 1 < totalSteps"
          :key="index"
          :class="{
            'text-blue-600': index < currentStep,
            'dark:text-blue-500': index < currentStep,
          }"
          class="flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
        >
          <span
            class="flex items-center flex-col sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
          >
            <div class="flex items-center">
              <FontAwesomeIcon
                v-if="index < currentStep"
                :icon="faCheckCircle"
                class="w-5 h-5 pr-2"
              />
              {{ step.name }}
            </div>
            <span v-if="step.optional" class="ml-1 text-xs">(Optional)</span>
          </span>
        </li>
      </template>
      <li class="flex items-center">
        {{ stepComponents[totalSteps - 1].name }}
      </li>
    </ol>
    <div class="">
      <component
        :is="stepComponents[currentStep].component"
        ref="childFormRef"
      ></component>
    </div>
    <div class="flex pt-4">
      <button
        v-if="currentStep > 0 && currentStep < totalSteps"
        class="text-white w-full inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        @click="previous()"
      >
        Previous step
      </button>
      <button
        v-if="currentStep + 1 !== totalSteps"
        :class="{
          'ml-2': currentStep !== 0,
          'bg-gray-600': validate,
          'dark:bg-gray-600': validate,
          'hover:bg-gray-600': validate,
          'dark:hover:bg-gray-600': validate,
        }"
        :disabled="validate"
        class="text-white w-full inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        @click="next()"
      >
        Next step
      </button>
      <button
        v-if="currentStep + 1 === totalSteps"
        :class="{
          'ml-2': currentStep !== 0,
          'cursor-not-allowed': isLoading,
        }"
        :disabled="isLoading"
        class="text-white w-full inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        @click="emit('onSubmit')"
      >
        <FontAwesomeIcon
          v-if="isLoading"
          :icon="faCircleNotch"
          class="w-4 h-4 animate-spin mr-2"
        />
        Confirm
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, type PropType, ref } from 'vue';
import {
  faCheckCircle,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { useFormStore } from '@velero-ui-app/stores/form.store';

const formStore = useFormStore();
const { currentStep, totalSteps } = storeToRefs(formStore);

const props = defineProps({
  stepComponents: [],
  isLoading: Boolean as PropType<boolean>,
});

onBeforeMount(() => formStore.reset());
onMounted(() => formStore.setTotalSteps(props.stepComponents.length));

const emit = defineEmits(['onSubmit']);

const childFormRef = ref(null);

const validate = computed(() => {
  return !childFormRef?.value?.validate?.();
});

const next = () => {
  if (!childFormRef.value.validate()) {
    return;
  }
  formStore.next(childFormRef.value.getForm());
};
const previous = () => {
  formStore.previous(childFormRef.value?.getForm?.());
};
</script>
