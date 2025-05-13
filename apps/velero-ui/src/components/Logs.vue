<template>
  <div class="grid grid-cols-1 px-4 xl:gap-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold dark:text-white">
          {{ t('log.title') }}
        </h3>
        <button
          v-if="
            data?.length > 0 &&
            canOr([
              { subject: Resources.BACKUP.plural, action: Action.Download },
              { subject: Resources.RESTORE.plural, action: Action.Download },
            ])
          "
          :disabled="isLoading"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="download()"
        >
          <FontAwesomeIcon
            v-if="!isLoading"
            :icon="faFileArrowDown"
            class="!w-4 !h-4 mr-2"
          />
          <FontAwesomeIcon
            v-else
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin mr-2"
          />
          {{ t('global.button.download.title') }}
        </button>
      </div>
      <div
        class="p-4 text-sm text-white bg-gray-900 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-white max-h-[500px] overflow-auto"
      >
        <div v-if="data" class="flex-col">
          <p v-for="(line, index) of data" :key="`line-${index}`">
            {{ line }}
          </p>
        </div>
        <div
          v-if="data?.length === 0 && !loading"
          class="inline-flex items-center"
        >
          <FontAwesomeIcon :icon="faInfoCircle" class="!w-4 !h-4" />
          <p class="ml-2">
            {{ t('log.text.noResult') }}
          </p>
        </div>
        <div v-if="loading" class="inline-flex items-center">
          <FontAwesomeIcon
            :icon="faCircleNotch"
            class="!w-4 !h-4 animate-spin"
          />
          <i class="ml-2">{{ t('log.text.loading') }}</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import {
  faCircleNotch,
  faFileArrowDown,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Resources, type V1DownloadTargetKind } from '@velero-ui/velero';
import { useLogsDownload } from '@velero-ui-app/composables/useLogsDownload';
import { useI18n } from 'vue-i18n';
import { canOr } from '@velero-ui-app/utils/policy.utils';
import { Action } from '@velero-ui/shared-types';

const { t } = useI18n();
const props = defineProps({
  data: { type: Array as PropType<string[]>, required: true },
  name: { type: String, required: true },
  loading: Boolean,
  type: { type: String as PropType<V1DownloadTargetKind>, required: true },
});

const { download, isLoading } = useLogsDownload(props.name, props.type);
</script>
