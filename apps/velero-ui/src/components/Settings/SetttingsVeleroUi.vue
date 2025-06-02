<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon
        :icon="faHardDrive"
        class="!w-16 !h-16 dark:text-white"
      />
      <div class="flex-1 min-w-0">
        <div>
          <h3
            class="flex items-center mb-1 text-lg font-bold text-gray-900 dark:text-white"
          >
            {{ t('settings.ui.title') }}
            <span
              v-if="socket.connected"
              :title="t('global.online')"
              class="h-2.5 w-2.5 rounded-full bg-green-400 ml-2"
            />
            <span
              v-if="!socket.connected"
              :title="t('global.offline')"
              class="h-2.5 w-2.5 rounded-full bg-red-500 ml-2"
            />
          </h3>
          <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">
            {{ data?.mode }}
            <Skeleton v-if="!data" class="mb-4" height="2.5" width="48" />
          </div>
          <div class="mb-1 text-xs text-gray-500 dark:text-gray-400">
            {{ data?.version }}
            <Skeleton v-if="!data" class="mb-4" width="72" />
          </div>
        </div>
      </div>
      <div class="inline-flex items-center">
        <button
          :class="{ 'cursor-not-allowed': isStandalone() }"
          :disabled="isStandalone()"
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-center text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          data-tooltip-target="tooltip-button-logs-ui"
          type="button"
          @click="showModal = !showModal"
        >
          <FontAwesomeIcon :icon="faEye" class="!w-4 !h-4" />
        </button>
      </div>
    </div>
  </div>
  <ModalLogs
    v-if="showModal"
    :type="LogType.VeleroUI"
    name="Velero UI"
    @on-close="showModal = false"
  />
  <div
    :id="`tooltip-button-logs-ui`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{
      isStandalone()
        ? t('settings.ui.tooltip.standalone.title')
        : t('settings.ui.tooltip.logs.title')
    }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faHardDrive } from '@fortawesome/free-solid-svg-icons';
import { inject, onMounted, ref } from 'vue';
import { initTooltips } from 'flowbite';
import { useSettingsUI } from '@velero-ui-app/composables/settings/useSettingsUI';
import { useI18n } from 'vue-i18n';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import Skeleton from '@velero-ui-app/components/Skeleton.vue';
import { LogType } from '@velero-ui/shared-types';
import ModalLogs from '@velero-ui-app/components/Modals/ModalLogs.vue';

const showModal = ref(false);
const { data } = useSettingsUI();
const { t } = useI18n();

const socket: SocketIO = inject('socketIo');

const isStandalone = () => data.value?.mode === 'Standalone';

onMounted(() => initTooltips());
</script>
