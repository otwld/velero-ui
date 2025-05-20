<template>
  <div
    class="p-4 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-[600px] overflow-auto"
  >
    <div v-if="data && data.length > 0" class="font-mono overflow-auto">
      <div v-for="(line, index) in data" :key="`line-${index}`" class="flex">
        <span
          class="w-10 text-right pr-4 text-gray-500 dark:text-gray-400 select-none"
        >
          {{ index + 1 }}
        </span>
        <span v-html="highlightIndent(line)"></span>
      </div>
    </div>
    <div v-else class="inline-flex items-center">
      <FontAwesomeIcon :icon="faCircleNotch" class="!w-4 !h-4 animate-spin" />
      <i class="ml-2">{{ t('manifest.text.loading') }}</i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { highlightIndent } from '@velero-ui-app/utils/yaml.utils';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  data: { type: Array as PropType<string[]>, required: true }
});
</script>
