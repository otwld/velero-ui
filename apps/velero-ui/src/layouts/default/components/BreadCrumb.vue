<template>
  <div class="px-4 pt-6 mb-4 col-span-full xl:mb-2">
    <nav class="flex mb-5" aria-label="Breadcrumb">
      <ol
        class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2"
      >
        <li class="inline-flex items-center">
          <router-link
            to="/"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <FontAwesomeIcon :icon="faHouse" class="w-5 h-5 mr-2.5" />
            Home
          </router-link>
        </li>
        <li
          v-for="(route, index) in matchedRoutes"
          class="inline-flex items-center"
        >
          <router-link
            v-if="index > 0 && route"
            :to="route.path"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <FontAwesomeIcon
              :icon="faChevronRight"
              class="w-4 h-4 text-gray-400 mr-2.5"
            />

            {{ route.name }}
          </router-link>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const router: Router = useRouter();

const matchedRoutes = computed(() => router.currentRoute.value.matched);
</script>
