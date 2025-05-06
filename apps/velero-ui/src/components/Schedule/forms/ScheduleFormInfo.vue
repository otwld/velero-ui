<template>
  <FormKit
    id="schedule-form-info"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            name="name"
            :placeholder="t('form.placeholder.scheduleName')"
            :validation="
              [['required'], ['k8s_name'], ['length', 4]]
            "
            type="text"
          >
            <template #label="context">
              <label
                class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
                >{{ t('form.field.scheduleName') }} *
              </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <FormKit
            name="schedule"
            :placeholder="t('form.placeholder.cron')"
            :validation="
              [['cron']]
            "
            help="sec min hour day month day-of-week (ex: * 6 * * * *)"
            type="text"
          >
            <template #label="context">
              <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            >{{ t('resource.spec.schedule') }} *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-schedule"
            />
          </label>
            </template>
          </FormKit>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ t('global.options') }}
            </p>
            <label class="inline-flex items-center mb-5">
              <FormKit
                name="useOwnerReferencesInBackup"
                type="checkbox"
                input-class="sr-only peer"
                label-class="ml-2"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                outer-class="flex items-center"
              >
                 <template #decorator>
                  <span
                    class="peer
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-white after:content-['']
                      after:absolute after:top-0.5 after:start-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600
                      peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
                >{{ t('resource.spec.useOwnerReferencesInBackup') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-use-owner-references-in-backup"
              />
            </label>
            <label class="inline-flex items-center mb-5 ">
              <FormKit
                name="skipImmediately"
                type="checkbox"
                input-class="sr-only peer"
                label-class="ml-2"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                outer-class="flex items-center"
              >
                 <template #decorator>
                  <span
                    class="peer
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-white after:content-['']
                      after:absolute after:top-0.5 after:start-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600
                      peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
                >{{ t('resource.spec.skipImmediately') }}
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-skip-immediately"
              />
            </label>
            <label class="inline-flex items-center mb-5">
              <FormKit
                name="paused"
                type="checkbox"
                input-class="sr-only peer"
                label-class="ml-2"
                wrapper-class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                outer-class="flex items-center"
              >
                 <template #decorator>
                  <span
                    class="peer
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-white after:content-['']
                      after:absolute after:top-0.5 after:start-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600
                      peer-checked:bg-blue-600"
                  />
                </template>
              </FormKit>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-white"
                >{{ t('global.paused') }}</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-paused"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </FormKit>
  <div
    id="tooltip-schedule"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.schedule') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-paused"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.paused') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-use-owner-references-in-backup"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.useOwnerReferencesInBackup') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-skip-immediately"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.skipImmediately') }}
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
const { currentStep, formContent } = storeToRefs(formStore);

const formContext = useFormKitContextById('schedule-form-info');

const currentForm = ref({
  name: '',
  schedule: '0 7 * * *',
  useOwnerReferencesInBackup: true,
  paused: false,
  skipImmediately: false,
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () => formContext.value.state.valid

const getForm = () => formContext.value.value;

defineExpose({
  validate,
  getForm,
});
</script>
