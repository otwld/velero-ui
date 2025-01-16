<template>
  <div>
    <dl>
      <template
        v-if="formContent[0]?.type === CreateBackupTypeEnum.FROM_SCHEDULE"
      >
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          {{ t('form.field.backupName') }} *
        </dt>
        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
          {{ formContent[1]?.name }}
        </dd>
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          {{ t('form.field.schedule') }}
        </dt>
        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
          {{ formContent[1]?.schedule }}
        </dd>
      </template>
      <template
        v-if="formContent[0]?.type === CreateBackupTypeEnum.FROM_SCRATCH"
      >
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('form.field.backupName') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.name }}
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.ttl') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.ttl }} {{ formContent[1]?.ttlUnit }}
            </dd>
          </div>
        </div>
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.includedNamespaces') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <li v-if="formContent[1]?.includedNamespaces.length === 0">*</li>
              <ul
                v-if="formContent[1]?.includedNamespaces.length > 0"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(namespace, index) of formContent[1]
                    ?.includedNamespaces"
                  :key="index"
                >
                  {{ namespace }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.excludedNamespaces') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <p v-if="formContent[1]?.excludedNamespaces.length === 0">-</p>
              <ul
                v-if="formContent[1]?.excludedNamespaces.length > 0"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(namespace, index) of formContent[1]
                    ?.excludedNamespaces"
                  :key="index"
                >
                  {{ namespace }}
                </li>
              </ul>
            </dd>
          </div>
        </div>
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.includedResources') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <ul
                v-if="formContent[2]?.includedResources"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(resource, index) of formContent[2]?.includedResources"
                  :key="index"
                >
                  {{ resource }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.excludedResources') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <p v-if="formContent[2]?.excludedResources.length === 0">-</p>
              <ul
                v-if="formContent[2]?.excludedResources"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(resource, index) of formContent[2]?.excludedResources"
                  :key="index"
                >
                  {{ resource }}
                </li>
              </ul>
            </dd>
          </div>
        </div>
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.volumeSnapshotLocations') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <ul
                v-if="formContent[1]?.volumeSnapshotLocations.length > 0"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(volume, index) of formContent[1]
                    ?.volumeSnapshotLocations"
                  :key="index"
                >
                  {{ volume }}
                </li>
              </ul>
            </dd>
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.storageLocation') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.storageLocation }}
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('global.options') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <ul
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li class="flex items-center">
                  <FontAwesomeIcon
                    v-if="formContent[1]?.snapshotVolumes"
                    :icon="faCheckCircle"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    v-if="!formContent[1]?.snapshotVolumes"
                    :icon="faXmarkCircle"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  {{ t('resource.spec.snapshotVolumes') }}
                </li>
                <li class="flex items-center">
                  <FontAwesomeIcon
                    v-if="formContent[1]?.snapshotMoveData"
                    :icon="faCheckCircle"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    v-if="!formContent[1]?.snapshotMoveData"
                    :icon="faXmarkCircle"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  {{ t('resource.spec.snapshotMoveData') }}
                </li>
                <li class="flex items-center">
                  <FontAwesomeIcon
                    v-if="formContent[1]?.defaultVolumesToFsBackup"
                    :icon="faCheckCircle"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    v-if="!formContent[1]?.defaultVolumesToFsBackup"
                    :icon="faXmarkCircle"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  {{ t('resource.spec.defaultVolumesToFsBackup') }}
                </li>
                <li class="flex items-center">
                  <FontAwesomeIcon
                    v-if="formContent[2]?.includeClusterResources"
                    :icon="faCheckCircle"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    v-if="!formContent[2]?.includeClusterResources"
                    :icon="faXmarkCircle"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  {{ t('resource.spec.includeClusterResources') }}
                </li>
              </ul>
            </dd>
          </div>
        </div>
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.csiSnapshotTimeout') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.csiSnapshotTimeout }}
              {{ formContent[1]?.csiSnapshotTimeoutUnit }}
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.itemOperationTimeout') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.itemOperationTimeout }}
              {{ formContent[1]?.itemOperationTimeoutUnit }}
            </dd>
          </div>
        </div>
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.datamover') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{
                formContent[1]?.datamover ? formContent[1]?.datamover : 'velero'
              }}
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.parallelFilesUpload') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.parallelFilesUpload }}
            </dd>
          </div>
        </div>
        <div
          v-if="Object.entries(formContent[3]?.labelsSelector).length > 0"
          class="grid gap-4 mb-2 grid-cols-1"
        >
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.labelSelector') }}
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
                  <th class="px-6 py-1.5" scope="col">{{ t('global.key') }}</th>
                  <th class="px-6 py-1.5" scope="col">{{ t('global.value') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(c, index) in Object.entries(
                    formContent[3]?.labelsSelector,
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
          v-if="Object.entries(formContent[3]?.labels).length > 0"
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
                  <th class="px-6 py-1.5" scope="col">{{ t('global.key') }}</th>
                  <th class="px-6 py-1.5" scope="col">{{ t('global.value') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(c, index) in Object.entries(formContent[3]?.labels)"
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
      </template>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCheckCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { CreateBackupTypeEnum } from '@velero-ui/shared-types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const validate = () => true;

defineExpose({
  validate,
});
</script>
