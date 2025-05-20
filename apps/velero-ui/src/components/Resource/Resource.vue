<template>
  <div v-if="!error" class="min-h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <slot name="left" />
      </div>
      <div class="col-span-2">
        <slot name="right" />
      </div>
    </div>
    <slot name="bottom" />
  </div>
  <ResourceNotFound v-else :page="page" />
</template>

<script lang="ts" setup>
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import ResourceNotFound from '@velero-ui-app/components/Resource/ResourceNotFound.vue';

const router: Router = useRouter();

const props = defineProps({
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
  page: {
    type: Object,
    required: true,
  },
});
</script>
