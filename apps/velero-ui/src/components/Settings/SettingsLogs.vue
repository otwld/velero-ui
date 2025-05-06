<template>
  <div
    class="p-4 text-sm text-white bg-gray-900 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-white max-h-[750px] overflow-auto"
  >
    <div v-if="data?.length > 0" class="flex-col">
      <p v-for="(line, index) of data" :key="`line-${index}`">
        {{ line }}
      </p>
    </div>
    <div v-if="data?.length === 0" class="inline-flex items-center">
      <FontAwesomeIcon :icon="faInfoCircle" class="!w-4 !h-4" />
      <p class="ml-2">
        {{ t('log.text.noResult') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useSettingsLogs } from '@velero-ui-app/composables/settings/useSettingsLogs';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  type: {type: String, required: true },
  name: {type: String, required: true },
});

const { t } = useI18n();

const { on, off, data } = useSettingsLogs(props.type, props.name);

onBeforeMount(() => on());
onBeforeUnmount(() => off());
</script>
