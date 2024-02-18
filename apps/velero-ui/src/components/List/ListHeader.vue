<template>
  <div
    class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="w-full mb-1">
      <div class="sm:flex">
        <div
          class="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700"
        >
          <div class="lg:pr-3">
            <label for="backups-search" class="sr-only">Search</label>
            <div class="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="backup"
                id="backups-search"
                v-model="searchInput"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>
          <div class="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
            <button
              type="button"
              href="#"
              class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FontAwesomeIcon :icon="faTrashCan" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
          <button
            type="button"
            data-modal-target="modal-add"
            data-modal-toggle="modal-add"
            class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 mr-2" />
            New
          </button>
          <button
            :disabled="loading"
            :class="{ 'cursor-not-allowed': loading }"
            type="button"
            @click="emit('onRefresh')"
            class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            <FontAwesomeIcon
              :icon="faArrowsRotate"
              :class="{
                'animate-spin': loading,
              }"
              class="w-4 h-4 mr-2"
            />
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
  <VModal id="modal-add" title="Test"></VModal>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowsRotate,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useListStore } from '../../stores/list.store';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import { initModals } from 'flowbite';
import { storeToRefs } from 'pinia';

const listStore = useListStore();
const { filters } = storeToRefs(listStore);

const searchInput = ref('');

const emit = defineEmits(['onRefresh', 'onNew']);

defineProps({
  loading: Boolean,
});

const interval = setInterval(() => {
  if (filters.value.startWith != searchInput.value) {
    listStore.applyNameFilter(searchInput.value);
    emit('onRefresh');
  }
}, 1000);

onMounted(() => initModals());
onBeforeUnmount(() => clearInterval(interval));
</script>
