<template>
  <div class="fixed z-50 right-2 bottom-2 min-w-[350px]">
    <div v-for="(toast, index) in toasts" :key="`toast-${index}`">
      <ToastItem
        @onDismiss="dismiss(index)"
        :message="toast.message"
        :type="toast.type"
        :icon="toast?.icon"
      ></ToastItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToastItem from '@velero-ui-app/components/Toasts/ToastItem.vue';
import { onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useToastsStore } from '@velero-ui-app/stores/toasts.store';

const toastsStore = useToastsStore();
const { toasts } = storeToRefs(toastsStore);


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
