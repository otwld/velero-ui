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
<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import BreadCrumb from './components/BreadCrumb.vue';

export default defineComponent({
  components: {Sidebar, Header, BreadCrumb },
});
</script>
