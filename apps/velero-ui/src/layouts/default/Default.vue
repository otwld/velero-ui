<template>
  <Header></Header>
  <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
    <Sidebar></Sidebar>
    <div
      class="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
    >
      <BreadCrumb></BreadCrumb>
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Header from '@velero-ui-app/layouts/default/components/Header.vue';
import Sidebar from '@velero-ui-app/layouts/default/components/Sidebar.vue';
import BreadCrumb from '@velero-ui-app/layouts/default/components/BreadCrumb.vue';
</script>
