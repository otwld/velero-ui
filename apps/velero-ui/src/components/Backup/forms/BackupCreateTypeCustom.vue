<template>
  <div>
    <div class="space-y-4 mb-4">
      <div class="grid gap-4 mb-4 grid-cols-2">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="name"
            >Backup name *</label
          >
          <FormKit
            id="name"
            v-model="currentForm.name"
            :validation="[
              ['required'],
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
            placeholder="Type backup name"
            required
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="ttl"
            >TTL * <span class="pl-1 text-xs">(ex 720h0m0s)</span>
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-ttl"
            />
          </label>
          <FormKit
            id="ttl"
            v-model="currentForm.ttl"
            :validation="[['required']]"
            :validation-messages="{}"
            input-class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            messages-class="mt-1 text-sm text-red-600 dark:text-red-500"
            name="TTL"
            placeholder="Type ttl"
            required
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="included-namespace"
            >Included Namespaces
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-included-namespace"
            />
          </label>
          <select
            id="included-namespace"
            v-model="currentForm.includedNamespaces"
            :disabled="!dataNamespaces || errorNamespaces"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            multiple
          >
            <template v-if="dataNamespaces?.items">
              <option
                v-for="(namespace, index) of dataNamespaces?.items"
                :value="namespace"
                :key="index"
              >
                {{ namespace }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="excluded-namespace"
            >Excluded Namespaces
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-excluded-namespace"
            />
          </label>
          <select
            id="excluded-namespace"
            v-model="currentForm.excludedNamespaces"
            :disabled="!dataNamespaces || errorNamespaces"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            multiple
          >
            <template v-if="dataNamespaces?.items">
              <option
                v-for="(namespace, index) of dataNamespaces?.items"
                :value="namespace"
                :key="index"
              >
                {{ namespace }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="included-resources"
            >Included Resources *
            <span class="pl-1 text-xs">(comma separated)</span>
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-included-resources"
            />
          </label>
          <input
            id="included-resources"
            v-model="currentForm.includedResources"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="included-resources"
            placeholder="Type resources"
            required
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="excluded-resources"
            >Excluded Resources
            <span class="pl-1 text-xs">(comma separated)</span>
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-excluded-resources"
            />
          </label>
          <input
            id="excluded-resources"
            v-model="currentForm.excludedResources"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="excluded-resources"
            placeholder="Type resources"
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="snapshot-location"
            >Snapshot Location *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-snapshot-location"
            />
          </label>
          <select
            id="snapshot-location"
            v-model="currentForm.volumeSnapshotLocations"
            :disabled="!dataSnapshotLocations || errorSnapshotLocations"
            class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            multiple
          >
            <template v-if="dataStorageLocations?.items">
              <option
                v-for="(location, index) of dataSnapshotLocations?.items"
                :value="location"
                :key="index"
              >
                {{ location }}
              </option>
            </template>
          </select>
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="storage-location"
            >Storage Location *
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-storage-location"
            />
          </label>
          <select
            id="storage-location"
            v-model="currentForm.storageLocation"
            :disabled="!dataStorageLocations || errorStorageLocations"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option selected value="">Select a storage location</option>
            <template v-if="dataStorageLocations?.items">
              <option
                v-for="(location, index) of dataStorageLocations?.items"
                :value="location"
                :key="index"
              >
                {{ location }}
              </option>
            </template>
          </select>
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
                v-model="currentForm.snapshotVolumes"
                checked
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >Snapshot Volume
              </span>
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-snapshot-volumes"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.snapshotMoveData"
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >Snapshot Move Data</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-snapshot-move-data"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.defaultVolumesToFsBackup"
                checked
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >Default Volumes to FS Backup</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-default-volumes"
              />
            </label>
            <label class="inline-flex items-center mb-5 cursor-pointer">
              <input
                v-model="currentForm.includeClusterResources"
                checked
                class="sr-only peer"
                type="checkbox"
                value=""
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500"
                >Include Cluster Resources</span
              >
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help dark:text-white dark:hover:text-gray-200"
                data-tooltip-style="light"
                data-tooltip-target="tooltip-include-cluster-resources"
              />
            </label>
          </div>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="labels"
            >Labels <span class="pl-1 text-xs">(comma separated)</span>
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-labels"
            />
          </label>
          <input
            id="labels"
            v-model="currentForm.labels"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="labels"
            placeholder="Type labels"
            type="text"
          />
        </div>
        <div class="col-span-2 sm:col-span-1">
          <label
            class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center"
            for="selectors"
            >Label Selector
            <FontAwesomeIcon
              :icon="faQuestionCircle"
              class="pl-1 w-3 h-3 hover:text-gray-700 hover:cursor-help"
              data-tooltip-style="light"
              data-tooltip-target="tooltip-label-selector"
            />
          </label>
          <input
            id="selectors"
            v-model="currentForm.labelSelector"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="selectors"
            placeholder="Type selectors"
            type="text"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    id="tooltip-ttl"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    How long before the backup can be garbage collected.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-included-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Namespaces to include in the backup. If nothing is selected, all namespaces
    are included.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-namespace"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Namespaces to exclude from the backup.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-included-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Resources to include in the backup, formatted as resource.group, such as
    storageclasses.storage.k8s.io (use '*' for all resources).
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Resources to exclude from the backup, formatted as resource.group, such as
    storageclasses.storage.k8s.io.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-excluded-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Resources to exclude from the backup, formatted as resource.group, such as
    storageclasses.storage.k8s.io.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-snapshot-location"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    List of locations (at most one per provider) where volume snapshots should
    be stored.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-storage-location"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Location in which to store the backup.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-labels"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Labels to apply to the backup. For example, foo=bar or app=nginx
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-label-selector"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Only back up resources matching this label selector. For example, foo=bar or app=nginx
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-snapshot-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Take snapshots of PersistentVolumes as part of the backup.
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-snapshot-move-data"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Specify whether snapshot data should be moved
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-default-volumes"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Use pod volume file system backup by default for volumes
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div
    id="tooltip-include-cluster-resources"
    class="absolute z-10 invisible inline-block px-3 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
    role="tooltip"
  >
    Include cluster-scoped resources in the backup.
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
import { useFormNamespaces } from '@velero-ui-app/composables/form/useFormNamespaces';
import { useFormStorageLocations } from '@velero-ui-app/composables/form/useFormStorageLocations';
import { useFormSnapshotLocations } from '@velero-ui-app/composables/form/useFormSnapshotLocations';

const formStore = useFormStore();
const { currentStep, formContent } = storeToRefs(formStore);

const { data: dataNamespaces, isError: errorNamespaces } = useFormNamespaces();

const { data: dataStorageLocations, isError: errorStorageLocations } =
  useFormStorageLocations();

const { data: dataSnapshotLocations, isError: errorSnapshotLocations } =
  useFormSnapshotLocations();

const currentForm = ref({
  name: '',
  ttl: '',
  includedNamespaces: [],
  includedResources: '',
  excludedNamespaces: [],
  excludedResources: '',
  volumeSnapshotLocations: [],
  storageLocation: '',
  snapshotVolumes: true,
  snapshotMoveData: false,
  defaultVolumesToFsBackup: true,
  includeClusterResources: true,
  labels: '',
  labelSelector: '',
});

onMounted(() => initTooltips());

onMounted(() => {
  currentForm.value = {
    ...currentForm.value,
    ...formContent.value[currentStep.value],
  };
});

const validate = () =>
  !!(
    currentForm.value?.name &&
    currentForm.value?.ttl &&
    currentForm.value?.includedResources &&
    currentForm.value?.volumeSnapshotLocations.length > 0 &&
    currentForm.value?.storageLocation
  );

const getForm = () => currentForm.value;

defineExpose({
  validate,
  getForm,
});
</script>
