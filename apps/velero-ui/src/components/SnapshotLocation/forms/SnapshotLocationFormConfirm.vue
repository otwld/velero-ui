<template>
  <div>
    <dl>
      <div class="grid gap-4 mb-2 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('form.field.volumeSnapshotLocationName') }} *
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {{ formContent[0]?.name }}
          </dd>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.provider') }} *
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {{ formContent[0]?.provider }}
          </dd>
        </div>
      </div>
      <div
        v-if="formContent[1]?.credential.name"
        class="grid gap-4 mb-2 grid-cols-2"
      >
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.credentialName') }}
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {{ formContent[1]?.credential.name }}
          </dd>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.credentialKey') }}
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {{ formContent[1]?.credential.key }}
          </dd>
        </div>
      </div>
      <div
        v-if="Object.entries(formContent[2]?.configuration).length > 0"
        class="grid gap-4 mb-2 grid-cols-1"
      >
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          {{ t('resource.spec.config') }}
        </dt>
        <dd
          class="font-light mb-4 text-gray-500 dark:text-gray-400 overflow-x-auto"
        >
          <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th class="px-6 py-1.5" scope="col">
                  {{ t('global.key') }}
                </th>
                <th class="px-6 py-1.5" scope="col">
                  {{ t('global.value') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(c, index) in Object.entries(
                  formContent[2]?.configuration,
                )"
                :key="index"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  class="px-6 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  scope="row"
                >
                  {{ c[0] }}
                </th>
                <td class="px-6 py-1.5">
                  {{ c[1] }}
                </td>
              </tr>
            </tbody>
          </table>
        </dd>
      </div>
      <div
        v-if="Object.entries(formContent[2]?.labels).length > 0"
        class="grid gap-4 mb-2 grid-cols-1"
      >
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          {{ t('resource.metadata.labels') }}
        </dt>
        <dd
          class="font-light mb-4 text-gray-500 dark:text-gray-400 overflow-x-auto"
        >
          <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th class="px-6 py-1.5" scope="col">
                  {{ t('global.key') }}
                </th>
                <th class="px-6 py-1.5" scope="col">
                  {{ t('global.value') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(c, index) in Object.entries(formContent[2]?.labels)"
                :key="index"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  class="px-6 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  scope="row"
                >
                  {{ c[0] }}
                </th>
                <td class="px-6 py-1.5">
                  {{ c[1] }}
                </td>
              </tr>
            </tbody>
          </table>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const validate = () => true;

defineExpose({
  validate,
});
</script>
