<template xmlns="http://www.w3.org/1999/html">
  <div class="h-full bg-gray-50 dark:bg-gray-900">
    <SettingsCluster></SettingsCluster>
    <div class="grid grid-cols-1 px-4 pt-4 xl:grid-cols-3 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <SettingsVeleroServer></SettingsVeleroServer>
        <SetttingsVeleroUi></SetttingsVeleroUi>
      </div>
      <SettingsVeleroAgents></SettingsVeleroAgents>
    </div>
    <SettingsVeleroPlugins class="pb-6"></SettingsVeleroPlugins>
  </div>
</template>

<script setup lang="ts">
import SettingsCluster from '../components/Settings/SettingsCluster.vue';
import SettingsVeleroServer from '../components/Settings/SettingsVeleroServer.vue';
import SettingsVeleroAgents from '../components/Settings/SettingsVeleroAgents.vue';
import SetttingsVeleroUi from '../components/Settings/SetttingsVeleroUi.vue';
import SettingsVeleroPlugins from '../components/Settings/SettingsVeleroPlugins.vue';
</script>
