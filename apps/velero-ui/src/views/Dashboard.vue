<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="px-4 pb-2 flex justify-between items-center">
      <h1
        class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white"
      >
         {{ t('dashboard.stats.title.global')}}
      </h1>
      <a
        v-if="grafanaUrl"
        :href="grafanaUrl"
        target="_blank"
        class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-blue-700 sm:text-sm hover:bg-gray-100 dark:text-blue-500 dark:hover:bg-gray-700"
      >
        {{ t('dashboard.stats.global.button.grafana.title')}}
        <FontAwesomeIcon
          :icon="faArrowUpRightFromSquare"
          class="w-3 h-3 ml-2"
        />
      </a>
    </div>
    <DashboardBasicStats/>
    <div class="px-4 my-2 flex justify-between items-center">
      <h1
        class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white"
      >
        {{ t('backups.title')}}
      </h1>
      <router-link
        :to="Pages.BACKUPS.path"
        class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-blue-700 sm:text-sm hover:bg-gray-100 dark:text-blue-500 dark:hover:bg-gray-700"
      >
        {{ t('dashboard.stats.backups.button.see.title')}}
        <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 ml-2" />
      </router-link>
    </div>
    <div class="grid grid-cols-1 px-4 xl:grid-cols-2 xl:gap-4">
      <DashboardBackupsStatusStats/>
      <DashboardBackupsSuccessRateStats/>
    </div>
    <div class="px-4 my-2 flex justify-between items-center">
      <h1
        class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white"
      >
        {{ t('restores.title')}}
      </h1>
      <router-link
        :to="Pages.RESTORES.path"
        class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-blue-700 sm:text-sm hover:bg-gray-100 dark:text-blue-500 dark:hover:bg-gray-700"
      >
        {{ t('dashboard.stats.restores.button.see.title')}}
        <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 ml-2" />
      </router-link>
    </div>
    <div class="grid grid-cols-1 px-4 pb-4 xl:grid-cols-2 xl:gap-4">
      <DashboardRestoresStatusStats/>
      <DashboardRestoresSuccessRateStats/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faArrowUpRightFromSquare,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import DashboardBasicStats from '@velero-ui-app/components/Dashboard/DashboardBasicStats.vue';
import DashboardBackupsStatusStats from '@velero-ui-app/components/Dashboard/DashboardBackupsStatusStats.vue';
import DashboardBackupsSuccessRateStats from '@velero-ui-app/components/Dashboard/DashboardBackupsSuccessRateStats.vue';
import DashboardRestoresStatusStats from '@velero-ui-app/components/Dashboard/DashboardRestoresStatusStats.vue';
import DashboardRestoresSuccessRateStats from '@velero-ui-app/components/Dashboard/DashboardRestoresSuccessRateStats.vue';
import { inject } from 'vue';
import type { AppConfig } from '@velero-ui/shared-types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { grafanaUrl } = inject('config') as AppConfig;
</script>
