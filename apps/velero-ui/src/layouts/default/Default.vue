<template>
  <Header/>
  <div class="flex overflow-hidden">
    <Sidebar/>
    <div
      :class="{ 'lg:ml-64': hideSidebar }"
      class="relative w-full mt-16 h-full min-h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <BreadCrumb/>
      <router-view/>
    </div>
  </div>
  <Toasts/>
</template>
<script lang="ts" setup>
import Header from '@velero-ui-app/layouts/default/components/Header.vue';
import Sidebar from '@velero-ui-app/layouts/default/components/Sidebar.vue';
import BreadCrumb from '@velero-ui-app/layouts/default/components/BreadCrumb.vue';
import Toasts from '@velero-ui-app/components/Toasts/Toasts.vue';
import { useAppStore } from '@velero-ui-app/stores/app.store';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();
const { hideSidebar } = storeToRefs(appStore);
</script>
