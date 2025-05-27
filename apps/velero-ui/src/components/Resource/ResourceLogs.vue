<template>
  <div class="grid grid-cols-1 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold dark:text-white">
          {{ t('log.title') }}
        </h3>
      </div>
      <div class="h-[600px]">
        <Logs :data="data" :loading="loading" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import { type V1DownloadTargetKind } from '@velero-ui/velero';
import { useI18n } from 'vue-i18n';
import { type Log } from '@velero-ui/shared-types';
import Logs from '@velero-ui-app/components/Log/Logs.vue';

const { t } = useI18n();
defineProps({
  data: { type: Array as PropType<Log[]>, required: true },
  name: { type: String, required: true },
  loading: { type: Boolean, required: false, default: false },
  type: { type: String as PropType<V1DownloadTargetKind>, required: true },
});
</script>
