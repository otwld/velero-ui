<template>
  <Header></Header>
  <div class="flex pt-16 overflow-hidden">
    <Sidebar></Sidebar>
    <div
      class="relative w-full h-full min-h-[calc(100vh-4rem)] overflow-y-auto lg:ml-64"
    >
      <BreadCrumb></BreadCrumb>
        <router-view></router-view>
    </div>
  </div>
  <Toasts></Toasts>
</template>
<script lang="ts" setup>
import Header from '@velero-ui-app/layouts/default/components/Header.vue';
import Sidebar from '@velero-ui-app/layouts/default/components/Sidebar.vue';
import BreadCrumb from '@velero-ui-app/layouts/default/components/BreadCrumb.vue';
import Toasts from '@velero-ui-app/components/Toasts/Toasts.vue';
</script>
