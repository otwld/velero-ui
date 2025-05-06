<template>
  <ol
    v-if="totalSteps > 1"
    class="flex pb-4 items-center justify-between w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
  >
    <template v-for="(step, index) of steps">
      <li
        v-if="index + 1 < totalSteps"
        :key="index"
        :class="{
          'text-blue-600': index < currentStep,
          'dark:text-blue-500': index < currentStep,
        }"
        class="flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-6 dark:after:border-gray-700"
      >
        <div
          class="flex items-center flex-col sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
        >
          <span class="flex items-center text-xs">
            <FontAwesomeIcon
              v-if="index < currentStep"
              :icon="faCheckCircle"
              class="!w-5 !h-5 pr-2"
            />
            {{ step.name }}
          </span>
          <span v-if="step.optional" class="ml-1 text-xs">{{
            t('global.optional')
          }}</span>
        </div>
      </li>
    </template>
    <li class="flex items-center text-xs">
      {{ steps[totalSteps - 1]?.name }}
    </li>
  </ol>
  <div class="">
    <div v-if="error" class="">
      <div
        class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <FontAwesomeIcon
          :icon="faInfoCircle"
          class="flex-shrink-0 inline !w-4 !h-4 me-3 mt-[2px]"
        />
        <div>
          <span class="font-medium">{{ t('global.error') }}</span>
          <ul class="mt-1.5 list-disc list-inside">
            <li>---</li>
          </ul>
        </div>
        <button
          aria-label="Close"
          class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1 hover:bg-red-200 inline-flex items-center justify-center h-6 w-6 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
          type="button"
          @click="emit('dismissError')"
        >
          <FontAwesomeIcon :icon="faXmark" class="!w-3 !h-3" />
        </button>
      </div>
    </div>
    <component :is="steps[currentStep].component" ref="childFormRef" />
  </div>
  <div class="flex pt-4">
    <button
      v-if="currentStep > 0 && currentStep < totalSteps"
      class="text-white w-full inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="button"
      @click="previous()"
    >
      {{ t('global.button.previousStep.title') }}
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
      {{ t('global.button.nextStep.title') }}
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
        class="!w-4 !h-4 animate-spin mr-2"
      />
      {{ t('global.button.confirm.title') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  type PropType,
  ref,
  watch,
} from 'vue';
import {
  faCheckCircle,
  faCircleNotch,
  faInfoCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formStore = useFormStore();
const { currentStep, totalSteps } = storeToRefs(formStore);

const props = defineProps({
  reset: {
    type: Boolean,
    default: true,
  },
  stepComponents: {type: Array as PropType<any[]>, required: true},
  isLoading: Boolean as PropType<boolean>,
  error: Error as PropType<Error>,
  notApplicableFields: {type: Object as PropType<object>, required: true},
});

const steps = ref(props.stepComponents.filter((c) => !c.hidden));

onBeforeMount(() => (props.reset ? formStore.reset() : true));
onMounted(() => {
  formStore.setTotalSteps(steps.value.length);
  formStore.setNotApplicableFields(props.notApplicableFields);
});

const emit = defineEmits(['onSubmit', 'dismissError']);

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

watch(
  props,
  () => {
    steps.value = props.stepComponents.filter((c) => !c.hidden);
    formStore.setTotalSteps(steps.value.length);
  },
  { deep: true },
);
</script>
