<template>
  <div class="px-4 py-6 col-span-full bg-gray-50 dark:bg-gray-900">
    <nav aria-label="Breadcrumb" class="flex justify-between">
      <ol
        class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2"
      >
        <li class="inline-flex items-center">
          <router-link
            :to="Pages.HOME.path"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <FontAwesomeIcon :icon="faHouse" class="!w-5 !h-5" />
          </router-link>
        </li>
        <li
          v-for="(route, index) in matchedRoutes"
          :key="`crumb-${index}`"
          class="inline-flex items-center"
        >
          <FontAwesomeIcon
            v-if="index > 0 && route.name"
            :icon="faChevronRight"
            class="!w-4 !h-4 text-gray-400 mr-2.5"
          />
          <router-link
            v-if="index > 0 && index < matchedRoutes.length - 1 && route.name"
            :to="route.path"
            class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            <span>{{
              route.path.includes(':name') ? getName() : route.name
            }}</span>
          </router-link>
          <span
            v-if="index === matchedRoutes.length - 1 && route.name"
            class="text-gray-400 dark:text-gray-500"
          >
            {{ route.path.includes(':name') ? getName() : route.name }}
          </span>
        </li>
      </ol>
      <a
        v-if="getDocumentationURL()"
        :href="getDocumentationURL()"
        :title="t('global.documentation')"
        class="inline-flex text-sm items-center hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
        target="_blank"
      >
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="pr-2 !w-4 !h-4"
        />
        {{ t('global.docs') }}
      </a>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowUpRightFromSquare,
  faChevronRight,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router: Router = useRouter();

const matchedRoutes = computed(() => router.currentRoute.value.matched);

const getName = () => router.currentRoute.value.params.name;

const getDocumentationURL = () => {
  switch (router.currentRoute.value.path) {
    case Pages.BACKUPS.path:
      return 'https://velero.io/docs/latest/backup-reference/';
    case Pages.SCHEDULES.path:
      return 'https://velero.io/docs/latest/backup-reference/#schedule-a-backup';
    case Pages.RESTORES.path:
      return 'https://velero.io/docs/latest/restore-reference/';
    case Pages.SNAPSHOT_LOCATIONS.path:
    case Pages.STORAGE_LOCATIONS.path:
      return 'https://velero.io/docs/v1.15/locations/';
    default:
      return '';
  }
};
</script>
