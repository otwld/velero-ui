<template>
  <div
    class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
    >
      <FontAwesomeIcon :icon="faHardDrive" class="w-16 h-16 dark:text-white" />

      <div class="flex-1 min-w-0">
        <h3
          class="flex items-center mb-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ t('settings.server.title') }}
          <span
            v-if="data?.connected && socket.connected"
            :title="t('global.online')"
            class="h-2.5 w-2.5 rounded-full bg-green-400 ml-2"
          />
          <span
            v-if="!data?.connected || !socket.connected"
            :title="t('global.offline')"
            class="h-2.5 w-2.5 rounded-full bg-red-500 ml-2"
          />
        </h3>
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">
          {{ data?.name }}
          <div
            v-if="!data"
            class="h-2.5 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-48 mb-4"
          ></div>
        </div>
        <div class="mb-1 text-xs text-gray-500 dark:text-gray-400">
          {{ data?.version }}
          <div
            v-if="!data"
            class="h-2 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700 w-72 mb-4"
          ></div>
        </div>
      </div>
      <div class="inline-flex items-center">
        <button
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-center text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          data-tooltip-target="tooltip-button-logs-server"
          type="button"
          @click="showModal = !showModal"
        >
          <FontAwesomeIcon :icon="faEye" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
  <VModal
    v-if="showModal"
    id="modal-logs-server"
    width="w-10/12"
    @onClose="showModal = false"
  >
    <template v-slot:header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('settings.server.modal.logs.title') }}
      </h3>
    </template>
    <template v-slot:content>
      <SettingsLogs type="server"></SettingsLogs>
    </template>
  </VModal>
  <div
    :id="`tooltip-button-logs-server`"
    class="absolute w- z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('settings.server.tooltip.logs.title') }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts" setup>
import { faEye, faHardDrive } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { inject, onMounted, ref } from 'vue';
import { initTooltips } from 'flowbite';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import SettingsLogs from '@velero-ui-app/components/Settings/SettingsLogs.vue';
import { useSettingsServer } from '@velero-ui-app/composables/settings/useSettingsServer';
import { useI18n } from 'vue-i18n';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';

const showModal = ref(false);
const { data } = useSettingsServer();
const { t } = useI18n();

const socket: SocketIO = inject('socketIo');

onMounted((): void => initTooltips());
</script>
