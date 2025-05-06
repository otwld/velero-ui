<template>
  <div class="flex items-center space-x-4">
    <div class="flex items-center">
      <FontAwesomeIcon :icon="faMicrochip" class="!w-6 !h-6 dark:text-white" />
    </div>
    <div class="flex-1 min-w-0">
      <div
        class="flex items-center text-base font-semibold text-gray-900 truncate dark:text-white"
      >
        {{ data.name }}
        <div
          v-if="data.connected && socket.connected"
          :title="t('global.online')"
          class="h-2.5 w-2.5 rounded-full bg-green-400 ml-2"
        />
        <div
          v-if="!data.connected || !socket.connected"
          :title="t('global.offline')"
          class="h-2.5 w-2.5 rounded-full bg-red-500 ml-2"
        />
      </div>
      <p class="text-sm font-normal text-gray-500 truncate dark:text-gray-400">
        {{ data.node }}
      </p>
      <p class="text-xs font-normal text-gray-500 truncate dark:text-gray-400">
        {{ data.version }}
      </p>
    </div>
    <div class="inline-flex items-center">
      <p class="text-right dark:text-white">
        {{ data.ip }}
      </p>
    </div>
    <div class="inline-flex items-center">
      <button
        :data-tooltip-target="`tooltip-button-logs-agent-${data.name}`"
        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-center text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        type="button"
        @click="showModal = !showModal"
      >
        <FontAwesomeIcon :icon="faEye" class="!w-4 !h-4" />
      </button>
    </div>
  </div>
  <VModal
    v-if="showModal"
    id="modal-logs-server"
    width="w-10/12"
    @on-close="showModal = false"
  >
    <template #header>
      <h3 class="text-lg text-gray-500 dark:text-gray-400">
        {{ t('settings.agents.modal.logs.title') }}
        <span class="font-normal text-sm ml-2">{{ data.name }}</span>
      </h3>
    </template>
    <template #content>
      <SettingsLogs :name="data.name" :type="data.name" />
    </template>
  </VModal>
  <div
    :id="`tooltip-button-logs-agent-${data.name}`"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('settings.agents.tooltip.logs.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { inject, onMounted, type PropType, ref } from 'vue';
import { initTooltips } from 'flowbite';
import type { VeleroAgentSettings } from '@velero-ui/shared-types';
import VModal from '@velero-ui-app/components/Modals/VModal.vue';
import SettingsLogs from '@velero-ui-app/components/Settings/SettingsLogs.vue';
import { useI18n } from 'vue-i18n';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';

defineProps({
  data: {type: Object as PropType<VeleroAgentSettings>, required: true },
});

const socket: SocketIO = inject('socketIo');

const { t } = useI18n();
const showModal = ref(false);
onMounted(() => initTooltips());
</script>
