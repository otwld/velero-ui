<template>
  <div
    class="relative z-10"
  >
    <div
      class="fixed inset-0 bg-gray-500/75 transition-opacity"
    />

    <div class="fixed h-full w-full inset-0 z-10">
      <div
        class="flex h-full items-center justify-center p-4"
      >
        <div class="relative p-4 w-full max-w-4xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div
              class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600"
            >
              <h3
                class="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white"
              >
                {{ t('modal.text.title.manifest') }}
                <span class="font-normal text-sm ml-2">{{ name }}</span>
              </h3>
              <button
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                type="button"
                @click="emit('onClose')"
              >
                <FontAwesomeIcon :icon="faXmark" class="!w-5 !h-5" />
              </button>
            </div>
            <div class="flex items-center justify-end flex-wrap gap-x-4 m-4">
              <div class="inline-flex rounded-md shadow-xs">
                <button
                  v-copy-to-clipboard="stringify(data)"
                  class="inline-flex items-center px-4 py-1 text-sm font-medium bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                  type="button"
                >
                  <FontAwesomeIcon :icon="faCopy" class="!w-4 !h-4 mr-1.5" />
                  {{ t('global.button.copy.title') }}
                </button>
                <button
                  v-download="{
                    content: stringify(data),
                    filename: `${data?.metadata?.name}.yaml`,
                    type: 'text/yaml',
                  }"
                  class="inline-flex items-center px-4 py-1 text-sm font-medium bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                  type="button"
                >
                  <FontAwesomeIcon :icon="faFileArrowDown" class="!w-4 !h-4 mr-1.5" />
                  {{ t('global.button.download.title') }}
                </button>
              </div>
            </div>
            <CodeBlock :data="parseYaml(data)" class="m-4"/>
            <div
              class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
            >
              <button
                class="text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="
                  emit('onConfirm');
                  emit('onClose');
                "
              >
                {{ t('global.button.close.title') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faCopy, faFileArrowDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { PropType } from 'vue';
import { parseYaml } from '@velero-ui-app/utils/yaml.utils';
import { useI18n } from 'vue-i18n';
import CodeBlock from "@velero-ui-app/components/CodeBlock.vue";
import { stringify } from "yaml";

const { t } = useI18n();
defineProps({
  name: {type: String, required: true },
  data: { type: Object as PropType<any>, required: true },
});

const emit = defineEmits(['onConfirm', 'onClose']);
</script>
