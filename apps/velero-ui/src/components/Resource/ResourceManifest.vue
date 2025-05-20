<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div class="flow-root">
      <div class="flex items-center justify-between flex-wrap gap-x-4 pb-4">
        <h1 class="text-xl font-semibold dark:text-white">
          {{ t('manifest.title') }}
        </h1>
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
      <CodeBlock :data="parseYaml(data)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { parseYaml } from '@velero-ui-app/utils/yaml.utils';
import { useI18n } from 'vue-i18n';
import { faCopy, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { stringify } from 'yaml';
import { useToastsStore } from '@velero-ui-app/stores/toasts.store';
import CodeBlock from '@velero-ui-app/components/CodeBlock.vue';

const { t } = useI18n();

const props = defineProps({
  data: { type: Object as PropType<any>, required: true },
});
</script>
