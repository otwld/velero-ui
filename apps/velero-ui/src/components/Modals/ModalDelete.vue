<template>
  <div
    class="fixed left-0 right-0 z-50 items-center justify-center hidden overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full"
    id="delete-user-modal"
  >
    <div class="relative w-full h-full max-w-md px-4 md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
        <!-- Modal header -->
        <div class="flex justify-end p-2">
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
            data-modal-hide="modal-delete"
          >
            <FontAwesomeIcon :icon="faXmark" class="w-5 h-5" />
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 pt-0 text-center">
          <FontAwesomeIcon
            :icon="faExclamationCircle"
            class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-200"
          />
          <h3 class="mt-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete:
          </h3>
          <div class="flex justify-center ">
            <p
              class="mt-2 px-1 mb-6 text-sm rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
            >
              {{ name }}
            </p>
          </div>
          <button
            type="button"
            @click="remove()"
            data-modal-hide="modal-delete"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-800"
          >
            Yes, I'm sure
          </button>
          <button
            type="button"
            class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            data-modal-hide="modal-delete"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {
  faExclamationCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'ModalDelete',
  components: { FontAwesomeIcon },
  props: {
    name: String,
  },
  data: () => ({
    faExclamationCircle,
    faXmark,
  }),
  methods: {
    remove(): void {
      this.$parent.remove();
    },
  },
});
</script>
