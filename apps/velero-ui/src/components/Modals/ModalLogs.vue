<template>
  <div class="relative z-10">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />

    <div class="fixed h-full w-full inset-0 z-10">
      <div class="flex h-full items-center justify-center p-4">
        <div
          class="relative h-[80%] w-full bg-white rounded-lg shadow dark:bg-gray-800"
        >
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600"
          >
            <h3
              class="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white"
            >
              {{ t('log.title') }}
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
          <div class="p-4 h-[90%]">
            <Logs :data="data" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onBeforeMount, onBeforeUnmount, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { LogType } from '@velero-ui/shared-types';
import { useSettingsLogs } from '@velero-ui-app/composables/settings/useSettingsLogs';
import Logs from '@velero-ui-app/components/Log/Logs.vue';

const { t } = useI18n();
const props = defineProps({
  name: { type: String, required: false, default: undefined },
  type: { type: String as PropType<LogType>, required: true },
});

const { on, off, data } = useSettingsLogs(props.type, props.name);

onBeforeMount(() => on());
onBeforeUnmount(() => off());

const emit = defineEmits(['onConfirm', 'onClose']);
</script>
