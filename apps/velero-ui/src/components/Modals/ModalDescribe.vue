<template>
  <div
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-4xl max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600"
        >
          <h3
            class="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white"
          >
            Describe manifest:
            <span class="font-normal text-sm ml-2">{{ name }}</span>
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
            :data-modal-hide="`modal-describe-${name}`"
          >
            <FontAwesomeIcon :icon="faXmark" class="w-5 h-5" />
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <div
            class="p-4 text-sm w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-[600px] overflow-auto"
          >
            <div v-if="data">
              <p v-for="(line, index) of parseYaml(data)" :key="`line-${index}`" :style="indentYaml(line)">
                {{ line }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <button
            :data-modal-hide="`modal-describe-${name}`"
            class="text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { indentYaml, parseYaml } from '@velero-ui-app/utils/yaml.utils';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  name: String,
  data: Object as PropType<any>,
});
</script>
