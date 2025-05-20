<template>
  <div
    id="toast"
    class="flex items-center w-full max-w-xs px-3 py-2 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-700"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-800 dark:text-orange-200"
    >
      <FontAwesomeIcon :icon="faGlobe" class="!w-5 !h-5 animate-pulse" />
    </div>

    <div class="ml-3 text-sm font-normal">
      {{ t('global.connectionLost') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
