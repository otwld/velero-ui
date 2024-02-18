<template>
  <div class="px-4 py-6 col-span-full bg-gray-50 dark:bg-gray-900">
    <nav class="flex" aria-label="Breadcrumb">
      <ol
        class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2"
      >
        <li class="inline-flex items-center">
          <router-link
            :to="Pages.HOME.path"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <FontAwesomeIcon :icon="faHouse" class="w-5 h-5" />
          </router-link>
        </li>
        <li
          v-for="(route, index) in matchedRoutes"
          class="inline-flex items-center"
        >
          <FontAwesomeIcon
            v-if="index > 0 && route.name"
              :icon="faChevronRight"
              class="w-4 h-4 text-gray-400 mr-2.5"
            />
          <router-link
            v-if="index > 0 && index < matchedRoutes.length - 1 && route.name"
            :to="route.path"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <span>{{ route.path.includes(':name') ? getName() : route.name }}</span>
          </router-link>
          <span v-if="index === matchedRoutes.length - 1 && route.name" class="text-gray-400 dark:text-gray-500">
            {{ route.path.includes(':name') ? getName() : route.name }}
          </span>
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
import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import { Pages } from '@velero-ui-app/utils/constants.utils';

const router: Router = useRouter();

const matchedRoutes = computed(() => router.currentRoute.value.matched);

const getName = () => router.currentRoute.value.params.name;
</script>
