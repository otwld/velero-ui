<template>
  <div>
    <dl>
      <template v-if="formContent[0]?.type === 'template'">
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          Backup Name
        </dt>
        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
          {{ formContent[1]?.name }}
        </dd>
        <dt
          class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
        >
          Schedule
        </dt>
        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
          {{ formContent[1]?.schedule }}
        </dd>
      </template>
      <template v-if="formContent[0]?.type === 'custom'">
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              Backup Name
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
              TTL
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.ttl }}
            </dd>
          </div>
        </div>
        <div class="grid gap-4 mb-4 grid-cols-2">
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              Included Namespaces
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <p v-if="formContent[1]?.includedNamespaces.length === 0">*</p>
              <ul
                v-if="formContent[1]?.includedNamespaces.length > 0"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li v-for="(namespace, index) of formContent[1]?.includedNamespaces" :key="index">
                  {{ namespace }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              Excluded Namespaces
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <p v-if="formContent[1]?.excludedNamespaces.length === 0">-</p>
              <ul
                v-if="formContent[1]?.excludedNamespaces.length > 0"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li v-for="(namespace, index) of formContent[1]?.excludedNamespaces" :key="index">
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
              Included Resources
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <ul
                v-if="formContent[1]?.includedResources"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(resource, index) of formContent[1]?.includedResources
                    .replace(/\s/g, '')
                    .split(',')"
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
              Excluded Resources
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <p v-if="!formContent[1]?.excludedResources">-</p>
              <ul
                v-if="formContent[1]?.excludedResources"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li
                  v-for="(resource, index) of formContent[1]?.excludedResources
                    .replace(/\s/g, '')
                    .split(',')"
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
              Snapshot Location
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <ul
                v-if="formContent[1]?.volumeSnapshotLocations.length > 0"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li v-for="(volume, index) of formContent[1]?.volumeSnapshotLocations" :key="index">
                  {{ volume }}
                </li>
              </ul>
            </dd>
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              Storage Location
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
              Options
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <ul
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li class="flex items-center">
                  <FontAwesomeIcon
                    :icon="faCheckCircle"
                    v-if="formContent[1]?.snapshotVolumes"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    :icon="faXmarkCircle"
                    v-if="!formContent[1]?.snapshotVolumes"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  Snapshot Volume
                </li>
                <li class="flex items-center">
                  <FontAwesomeIcon
                    :icon="faCheckCircle"
                    v-if="formContent[1]?.snapshotMoveData"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    :icon="faXmarkCircle"
                    v-if="!formContent[1]?.snapshotMoveData"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  Snapshot Move Data
                </li>
                <li class="flex items-center">
                  <FontAwesomeIcon
                    :icon="faCheckCircle"
                    v-if="formContent[1]?.defaultVolumesToFsBackup"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    :icon="faXmarkCircle"
                    v-if="!formContent[1]?.defaultVolumesToFsBackup"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  Default Volumes to FS Backup
                </li>
                <li class="flex items-center">
                  <FontAwesomeIcon
                    :icon="faCheckCircle"
                    v-if="formContent[1]?.includeClusterResources"
                    class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-500 flex-shrink-0"
                  />
                  <FontAwesomeIcon
                    :icon="faXmarkCircle"
                    v-if="!formContent[1]?.includeClusterResources"
                    class="w-3.5 h-3.5 me-2 text-red-500 dark:text-red-500 flex-shrink-0"
                  />
                  Include Cluster Resources
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
              Labels
            </dt>
            <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              <p v-if="!formContent[1]?.labels">-</p>
              <ul
                v-if="formContent[1]?.labels"
                class="max-w-md space-y-1 list-disc list-inside dark:text-gray-400"
              >
                <li v-for="(label, index) of formContent[1]?.labels.split(',')" :key="index">
                  {{ label }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt
              class="mb-2 font-semibold leading-none text-gray-900 dark:text-white"
            >
              Label Selector
            </dt>
             <dd
              class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"
            >
              {{ formContent[1]?.labelSelector || '-' }}
            </dd>
          </div>
        </div>
      </template>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCheckCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';

const formStore = useFormStore();
const { formContent } = storeToRefs(formStore);

const validate = () => true;

defineExpose({
  validate,
});
</script>
