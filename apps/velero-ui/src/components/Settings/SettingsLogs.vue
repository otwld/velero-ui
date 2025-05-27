<template>
  <div
    class="p-4 text-sm text-white bg-gray-900 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-white max-h-[750px] overflow-auto"
  >
    <div v-if="data?.length > 0" class="flex flex-col space-y-2">
      <div
        v-for="(line, index) in data"
        :key="`line-${index}`"
        class="flex items-start space-x-4"
      >
        <!-- Time -->
        <div class="text-gray-400 min-w-[140px]">
          {{ convertTimestampToDate(line.date) }}
        </div>

        <!-- Level -->
        <span
          class="capitalize px-2 py-0.5 rounded text-xs font-semibold"
          :class="levelColor(line.level)"
        >
          {{ line.level }}
        </span>

        <!-- Message -->
        <p class="flex-1 text-white">
          {{ line.message }}
        </p>
      </div>
    </div>

    <div v-if="data?.length === 0" class="inline-flex items-center text-gray-400">
      <FontAwesomeIcon :icon="faInfoCircle" class="!w-4 !h-4" />
      <p class="ml-2">
        {{ t('log.text.noResult') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onBeforeMount, onBeforeUnmount, type PropType } from 'vue';
import { useSettingsLogs } from '@velero-ui-app/composables/settings/useSettingsLogs';
import { useI18n } from 'vue-i18n';
import { LogType } from "@velero-ui/shared-types";
import { convertTimestampToDate } from "@velero-ui-app/utils/date.utils";

const props = defineProps({
  type: { type: String as PropType<LogType>, required: true },
  name: { type: String, required: false, default: undefined },
});

const { t } = useI18n();

const { on, off, data } = useSettingsLogs(props.type, props.name);

onBeforeMount(() => on());
onBeforeUnmount(() => off());

const levelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'info':
      return 'bg-blue-600 text-white';
    case 'warn':
    case 'warning':
      return 'bg-yellow-500 text-black';
    case 'error':
      return 'bg-red-600 text-white';
    case 'debug':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-700 text-white';
  }
};
</script>
