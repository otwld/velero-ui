<template>
  <div
    v-if="newVersion && show"
    id="toast"
    class="flex items-center w-full max-w-xs px-3 py-2 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200"
    >
      <FontAwesomeIcon :icon="faArrowUp" class="!w-5 !h-5" />
    </div>

    <div class="ml-3 text-sm font-normal">
      Velero UI
      <a :href="newVersion.html_url" class="hover:underline" target="_blank">{{
        newVersion.tag_name
      }}</a>
      {{ t('global.nowAvailable') }}
    </div>
    <button
      aria-label="Close"
      class="ml-auto m-1 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      type="button"
      @click="show = false"
    >
      <span class="sr-only">Close</span>
      <FontAwesomeIcon :icon="faXmark" class="!w-3 !h-3" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import { onBeforeMount, ref } from 'vue';
import { useGithubVersionChecker } from '@velero-ui-app/composables/useGithubVersionChecker';

const { t } = useI18n();

const { get, newVersion } = useGithubVersionChecker('otwld', 'velero-ui');
const show = ref(true);

onBeforeMount(() => get(import.meta.env.APP_VERSION));

</script>
