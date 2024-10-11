<template>
  <div>
    <div class="space-y-4 mb-4">
      <div
        class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
        role="alert"
      >
        <FontAwesomeIcon
          :icon="faInfoCircle"
          class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
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
              Learn more
            </button>
          </a>
        </div>
      </div>
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="name"
            >Secret Referent
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-credential-name"
            />
          </label>
          <select
            id="name"
            v-model="currentForm.credential.name"
            :disabled="!data || isError"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option selected value="">Select a existing secret</option>
            <template v-if="data?.items">
              <option
                v-for="(secret, index) of data?.items"
                :key="index"
                :value="secret"
              >
                {{ secret }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="key"
            >Secret Key
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-credential-key"
            />
          </label>
          <FormKit
            id="key"
            v-model="currentForm.credential.key"
            :validation="[
              ['matches', /[a-zA-Z0-9.-]+/g],
              ['length', 5],
            ]"
            :validation-messages="{
              matches: 'Name can only include A-z, 0-9, and -.',
              length: 'Min length is 5 characters.',
            }"
            input-class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            messages-class="mt-1 text-sm text-red-600 dark:text-red-500"
            name="Name"
            placeholder="Type secret name"
            type="text"
          />
        </div>

        <div class="col-span-2 sm:col-span-1">
          <div class="flex flex-col">
            <p
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Options
            </p>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.credential.optional"
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >Is optional
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-credential-optional"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    id="tooltip-credential-name"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Name of the secret referent.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-credential-key"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    The key of the secret to select from. Must be a valid secret key.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-credential-optional"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Specify whether the Secret or its key must be defined.
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

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const { data, isError } = useFormSecrets();

const currentForm = ref({
  credential: {
    key: '',
    name: '',
    optional: true,
  },
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () => true;

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
