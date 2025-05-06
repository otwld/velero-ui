<template>
  <FormKit
    id="storage-location-form-credentials"
    v-model="currentForm"
    :actions="false"
    type="form"
  >
    <div class="space-y-4 mb-4">
      <div
        class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
        role="alert"
      >
        <FontAwesomeIcon
          :icon="faInfoCircle"
          class="flex-shrink-0 inline !w-4 !h-4 me-3 mt-[2px]"
        />
        <span class="sr-only">Info</span>
        <div>
          <span class="font-medium">About credentials:</span>
          <ul class="mt-1.5 list-disc list-inside">
            <li>
              It is possible to create additional BackupStorageLocations that
              use their own credentials. This enables you to save backups to
              another storage provider or to another account with the storage
              provider you are already using.
            </li>
            <li>
              If you create additional BackupStorageLocations without specifying
              the credentials to use, Velero will use the credentials provided
              at install time and stored in the cloud-credentials secret.
            </li>
          </ul>
          <a
            href="https://velero.io/docs/latest/locations/#create-a-storage-location-that-uses-unique-credentials"
            target="_blank"
          >
            <button
              class="text-white mt-2 bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="me-2 h-3 w-3"
              />
              {{ t('global.button.learnMore.title') }}
            </button>
          </a>
        </div>
      </div>
      <FormKit name="credential" type="group">
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <FormKit
              :disabled="!data || isError"
              :options="
                [{ label: t('form.placeholder.secret'), value: '' }].concat(
                  data?.items.map((i) => ({ label: i, value: i })),
                )
              "
              :placeholder="t('form.placeholder.secret')"
              name="name"
              outer-class="mb-2"
              type="select"
            >
              <template #label="context">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >{{ t('resource.spec.credentialName') }}
                  <FontAwesomeIcon
                    :icon="faQuestionCircle"
                    class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                    data-tooltip-style="light"
                    data-tooltip-target="tooltip-credential-name"
                  />
                </label>
              </template>
            </FormKit>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <FormKit
              :placeholder="t('form.placeholder.secretName')"
              :validation="[
                ['field'],
                ['length', 2],
              ]"
              name="key"
              type="text"
            >
              <template #label="context">
                <label
                  class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
                  >{{ t('resource.spec.credentialKey') }}
                  <FontAwesomeIcon
                    :icon="faQuestionCircle"
                    class="pl-1 !w-3 !h-3 hover:text-gray-700 hover:cursor-help"
                    data-tooltip-style="light"
                    data-tooltip-target="tooltip-credential-key"
                  />
                </label>
              </template>
            </FormKit>
          </div>
        </div>
      </FormKit>
    </div>
  </FormKit>

  <div
    id="tooltip-credential-name"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.credentialName') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-credential-key"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    {{ t('form.tooltip.credentialKey') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faInfoCircle,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { initTooltips } from 'flowbite';
import { useFormSecrets } from '@velero-ui-app/composables/form/useFormSecrets';
import { useI18n } from 'vue-i18n';
import { useFormKitContextById } from '@formkit/vue';

const { t } = useI18n();
const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const { data, isError } = useFormSecrets();

const formContext = useFormKitContextById('storage-location-form-credentials');

const currentForm = ref({
  credential: {
    key: '',
    name: '',
  },
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
