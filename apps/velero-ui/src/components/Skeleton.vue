<template>
  <div
    :class="{[`h-${height}`]: height, [`w-${width}`]: width}"
    class="bg-gray-200 rounded-full animate-pulse dark:bg-gray-700"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  height: {
    type: String,
    required: false,
    default: '2'
  },
  width: {
    type: String,
    required: false,
    default: '24'
  },
});
</script>
