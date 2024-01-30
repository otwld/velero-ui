<template xmlns="http://www.w3.org/1999/html">
  <ClusterSettings></ClusterSettings>
  <div
    class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900"
  >
    <div class="col-span-full xl:col-auto">
      <VeleroServerSettings></VeleroServerSettings>
      <VeleroUiSettings></VeleroUiSettings>
    </div>
    <VeleroServerAgentsSettings></VeleroServerAgentsSettings>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ClusterSettings from '../components/Settings/ClusterSettings.vue';
import VeleroServerSettings from '../components/Settings/VeleroServerSettings.vue';
import VeleroServerAgentsSettings from '../components/Settings/VeleroAgentsSettings.vue';
import VeleroUiSettings from '../components/Settings/VeleroUiSetttings.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    VeleroUiSettings,
    VeleroServerAgentsSettings,
    VeleroServerSettings,
    ClusterSettings,
  },
});
</script>
