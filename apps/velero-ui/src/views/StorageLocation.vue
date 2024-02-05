<template>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="col-span-full xl:col-auto">
      <StorageLocationActions :location="location"></StorageLocationActions>
    </div>
    <div class="col-span-2">
      <Describe :data="location"></Describe>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Describe from '../components/Describe.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { useStorageLocationStore } from '../stores/storage-location.store';
import StorageLocationActions from '../components/StorageLocation/StorageLocationActions.vue';

`
import type { Router } from 'vue-router';`;

export default defineComponent({
  name: 'StorageLocation',
  components: { StorageLocationActions, Describe },
  setup() {
    const storageLocationStore = useStorageLocationStore();
    const { location } = storeToRefs(storageLocationStore);

    const router: Router = useRouter();
    return { storageLocationStore, router, location };
  },
  beforeMount() {
    this.storageLocationStore.get(this.router.currentRoute.value.params.name);
  },
  methods: {
    remove(): void {
      console.log('click delete');
    },
  },
});
</script>
