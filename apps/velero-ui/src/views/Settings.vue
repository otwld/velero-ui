<template xmlns="http://www.w3.org/1999/html">
  <SettingsCluster></SettingsCluster>
  <div
    class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900"
  >
    <div class="col-span-full xl:col-auto">
      <SettingsVeleroServer></SettingsVeleroServer>
      <SetttingsVeleroUi></SetttingsVeleroUi>
    </div>
    <SettingsVeleroAgents></SettingsVeleroAgents>
  </div>
  <SettingsVeleroPlugins class="pb-6"></SettingsVeleroPlugins>
</template>

<script setup lang="ts">
import SettingsCluster from '../components/Settings/SettingsCluster.vue';
import SettingsVeleroServer from '../components/Settings/SettingsVeleroServer.vue';
import SettingsVeleroAgents from '../components/Settings/SettingsVeleroAgents.vue';
import SetttingsVeleroUi from '../components/Settings/SetttingsVeleroUi.vue';
import SettingsVeleroPlugins from '../components/Settings/SettingsVeleroPlugins.vue';

</script>
