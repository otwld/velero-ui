<template>
  <div class="fixed z-50 right-2 bottom-2 min-w-[350px]">
    <ToastNewVeleroVersion />
    <ToastNewVeleroUiVersion />
    <ToastConnectionLost v-if="!socket.connected" />
    <div v-for="(toast, index) in toasts" :key="`toast-${index}`">
      <ToastItem
        :icon="toast?.icon"
        :message="toast.message"
        :type="toast.type"
        @onDismiss="dismiss(index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ToastItem from '@velero-ui-app/components/Toasts/ToastItem.vue';
import { inject, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useToastsStore } from '@velero-ui-app/stores/toasts.store';
import ToastConnectionLost from '@velero-ui-app/components/Toasts/ToastConnectionLost.vue';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import ToastNewVeleroUiVersion from '@velero-ui-app/components/Toasts/ToastNewVeleroUiVersion.vue';
import ToastNewVeleroVersion from '@velero-ui-app/components/Toasts/ToastNewVeleroVersion.vue';

const toastsStore = useToastsStore();
const { toasts } = storeToRefs(toastsStore);

const socket: SocketIO = inject('socketIo');

const dismiss = (index) => toastsStore.remove(index);

const interval = setInterval(() => {
  toasts.value.forEach((t) => (t.delay -= 1000));
  toasts.value = toasts.value.filter((t) => t.delay > 0);
}, 1000);

onBeforeUnmount(() => {
  clearInterval(interval);
  toasts.value = [];
});
</script>
