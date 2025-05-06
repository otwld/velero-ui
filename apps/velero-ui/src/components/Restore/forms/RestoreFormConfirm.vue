<template>
  <div>
    <dl>
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('form.field.restoreName') }} *
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {{ formContent[0]?.name || formContent[1]?.name }}
          </dd>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <template
            v-if="formContent[0]?.type === CreateRestoreTypeEnum.FROM_SCHEDULE"
          >
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('form.field.schedule') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.scheduleName }}
            </dd>
          </template>
          <template
            v-if="formContent[0]?.type === CreateRestoreTypeEnum.FROM_BACKUP"
          >
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('global.backup') }} *
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[0]?.backupName || formContent[1]?.backupName }}
            </dd>
          </template>
        </div>
      </div>
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.includedNamespaces') }}
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <li
              v-if="
                formContent[1]?.includedNamespaces?.length === 0 ||
                  formContent[2]?.includedNamespaces?.length === 0
              "
            >
              *
            </li>
            <ul
              v-if="formContent[1]?.includedNamespaces?.length > 0"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(namespace, index) of formContent[1]?.includedNamespaces"
                :key="index"
              >
                {{ namespace }}
              </li>
            </ul>
            <ul
              v-if="formContent[2]?.includedNamespaces?.length > 0"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(namespace, index) of formContent[2]?.includedNamespaces"
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
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <p
              v-if="
                formContent[1]?.excludedNamespaces?.length === 0 ||
                  formContent[2]?.excludedNamespaces?.length === 0
              "
            >
              -
            </p>
            <ul
              v-if="formContent[1]?.excludedNamespaces?.length > 0"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(namespace, index) of formContent[1]?.excludedNamespaces"
                :key="index"
              >
                {{ namespace }}
              </li>
            </ul>
            <ul
              v-if="formContent[2]?.excludedNamespaces?.length > 0"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(namespace, index) of formContent[2]?.excludedNamespaces"
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
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <ul
              v-if="formContent[3]?.includedResources"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(resource, index) of formContent[3]?.includedResources"
                :key="index"
              >
                {{ resource }}
              </li>
            </ul>
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
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <p
              v-if="
                formContent[2]?.excludedResources?.length === 0 ||
                  formContent[3]?.excludedResources?.length === 0
              "
            >
              -
            </p>
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
            <ul
              v-if="formContent[3]?.excludedResources"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(resource, index) of formContent[3]?.excludedResources"
                :key="index"
              >
                {{ resource }}
              </li>
            </ul>
          </dd>
        </div>
      </div>
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div
          v-if="
            formContent[2]?.statusIncludedResources?.length > 0 ||
              formContent[3]?.statusIncludedResources?.length > 0
          "
          class="col-span-2 sm:col-span-1"
        >
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.restoreStatusIncludedResources') }}
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <ul
              v-if="formContent[3]?.statusIncludedResources"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(resource, index) of formContent[3]
                  ?.statusIncludedResources"
                :key="index"
              >
                {{ resource }}
              </li>
            </ul>
            <ul
              v-if="formContent[2]?.statusIncludedResources"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(resource, index) of formContent[2]
                  ?.statusIncludedResources"
                :key="index"
              >
                {{ resource }}
              </li>
            </ul>
          </dd>
        </div>
        <div
          v-if="
            formContent[2]?.statusExcludedResources?.length > 0 ||
              formContent[3]?.statusExcludedResources?.length > 0
          "
          class="col-span-2 sm:col-span-1"
        >
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('resource.spec.restoreStatusExcludedResources') }}
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <ul
              v-if="formContent[2]?.statusExcludedResources"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(resource, index) of formContent[2]
                  ?.statusExcludedResources"
                :key="index"
              >
                {{ resource }}
              </li>
            </ul>
            <ul
              v-if="formContent[3]?.statusExcludedResources"
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li
                v-for="(resource, index) of formContent[3]
                  ?.statusExcludedResources"
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
          <template
            v-if="
              formContent[1]?.itemOperationTimeout?.value ||
                formContent[2]?.itemOperationTimeout?.value
            "
          >
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.itemOperationTimeout') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{
                formContent[1]?.itemOperationTimeout?.value ||
                  formContent[2]?.itemOperationTimeout?.value
              }}
              {{
                formContent[1]?.itemOperationTimeout?.unit ||
                  formContent[2]?.itemOperationTimeout?.unit
              }}
            </dd>
          </template>
          <template
            v-if="
              formContent[1]?.parallelFilesDownload ||
                formContent[2]?.parallelFilesDownload
            "
          >
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.parallelFilesDownload') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{
                formContent[1]?.parallelFilesDownload ||
                  formContent[2]?.parallelFilesDownload
              }}
            </dd>
          </template>
          <template
            v-if="
              formContent[1]?.existingResourcePolicy ||
                formContent[2]?.existingResourcePolicy
            "
          >
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              {{ t('resource.spec.existingResourcePolicy') }}
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{
                formContent[1]?.existingResourcePolicy ||
                  formContent[2]?.existingResourcePolicy
              }}
            </dd>
          </template>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <dt
            class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
          >
            {{ t('global.options') }}
          </dt>
          <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            <ul
              class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
            >
              <li class="flex items-center">
                <FontAwesomeIcon
                  v-if="
                    formContent[1]?.includeClusterResources ||
                      formContent[2]?.includeClusterResources
                  "
                  :icon="faCheckCircle"
                  class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                />
                <FontAwesomeIcon
                  v-if="
                    (formContent[1].includeClusterResources !== undefined &&
                      !formContent[1]?.includeClusterResources) ||
                      (formContent[2].includeClusterResources !== undefined &&
                        !formContent[2]?.includeClusterResources)
                  "
                  :icon="faXmarkCircle"
                  class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                />
                {{ t('resource.spec.includeClusterResources') }}
              </li>
              <li class="flex items-center">
                <FontAwesomeIcon
                  v-if="
                    formContent[1]?.restorePVs || formContent[2]?.restorePVs
                  "
                  :icon="faCheckCircle"
                  class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                />
                <FontAwesomeIcon
                  v-if="
                    (formContent[1].restorePVs !== undefined &&
                      !formContent[1]?.restorePVs) ||
                      (formContent[2].restorePVs !== undefined &&
                        !formContent[2]?.restorePVs)
                  "
                  :icon="faXmarkCircle"
                  class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                />
                {{ t('resource.spec.restorePVs') }}
              </li>
              <li class="flex items-center">
                <FontAwesomeIcon
                  v-if="
                    formContent[1]?.preserveNodePorts ||
                      formContent[2]?.preserveNodePorts
                  "
                  :icon="faCheckCircle"
                  class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                />
                <FontAwesomeIcon
                  v-if="
                    (formContent[1].preserveNodePorts !== undefined &&
                      !formContent[1]?.preserveNodePorts) ||
                      (formContent[2].preserveNodePorts !== undefined &&
                        !formContent[2]?.preserveNodePorts)
                  "
                  :icon="faXmarkCircle"
                  class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                />
                {{ t('resource.spec.preserveNodePorts') }}
              </li>
              <li class="flex items-center">
                <FontAwesomeIcon
                  v-if="
                    formContent[1]?.writeSparseFiles ||
                      formContent[2]?.writeSparseFiles
                  "
                  :icon="faCheckCircle"
                  class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                />
                <FontAwesomeIcon
                  v-if="
                    (formContent[1].writeSparseFiles !== undefined &&
                      !formContent[1]?.writeSparseFiles) ||
                      (formContent[2].writeSparseFiles !== undefined &&
                        !formContent[2]?.writeSparseFiles)
                  "
                  :icon="faXmarkCircle"
                  class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                />
                {{ t('resource.spec.writeSparseFiles') }}
              </li>
            </ul>
          </dd>
        </div>
      </div>
      <div
        v-if="
          Object.entries(
            formContent[3]?.namespaceMappings ||
              formContent[4]?.namespaceMappings,
          )?.length > 0
        "
        class="grid gap-4 mb-2 grid-cols-1"
      >
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          {{ t('resource.spec.namespaceMapping') }}
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
                  {{ t('global.from') }}
                </th>
                <th class="px-6 py-1.5" scope="col">
                  {{ t('global.to') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(c, index) in Object.entries(
                  formContent[3]?.namespaceMappings ||
                    formContent[4]?.namespaceMappings,
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
        v-if="
          Object.entries(
            formContent[3]?.labelsSelector || formContent[4]?.labelsSelector,
          ).length > 0
        "
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
                  formContent[3]?.labelsSelector ||
                    formContent[4]?.labelsSelector,
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
        v-if="
          Object.entries(formContent[3]?.labels || formContent[4]?.labels)
            .length > 0
        "
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
                v-for="(c, index) in Object.entries(
                  formContent[3]?.labels || formContent[4]?.labels,
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
import { CreateRestoreTypeEnum } from '@velero-ui/shared-types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const validate = () => true;

defineExpose({
  validate,
});
</script>
