<template>
  <tr>
    <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
        <div class="text-base font-semibold text-gray-900 dark:text-white">
          {{ data.name }}
        </div>
      </div>
    </td>
    <td
      class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {{ data.kind }}
    </td>
    <td class="p-4 space-x-2 whitespace-nowrap">
      <button
        type="button"
        @click="remove()"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        <FontAwesomeIcon :icon="faTrashCan" class="w-4 h-4" />
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { V1PluginInfo } from '@velero-ui/velero';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'SettingsVeleroPluginLine',
  components: { FontAwesomeIcon },
  props: {
    data: Object as PropType<V1PluginInfo>,
  },
  data: () => ({
    faTrashCan,
  }),
});
</script>
