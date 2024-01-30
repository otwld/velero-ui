<template>
  <div class="px-4 pt-6 mb-4 col-span-full xl:mb-2">
    <nav class="flex mb-5" aria-label="Breadcrumb">
      <ol
        class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2"
      >
        <li
          v-for="(route, index) in matchedRoutes"
          class="inline-flex items-center"
        >
          <router-link
            v-if="route.name"
            :to="route.path"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <svg
              v-if="index === 0"
              class="w-5 h-5 mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              ></path>
            </svg>

            <svg
              v-if="index > 0"
              class="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>

            {{ route.name }}
          </router-link>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import router from '../../../plugins/router.plugin';

export default defineComponent({
  methods: {
    router() {
      return router;
    },
  },
  setup() {
    const router: Router = useRouter();
    return { router };
  },
  computed: {
    matchedRoutes() {
      return this.router.currentRoute.value.matched;
    },
  },
});
</script>
