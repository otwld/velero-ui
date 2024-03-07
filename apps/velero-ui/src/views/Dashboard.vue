<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900">
    <DashboardBasicStats></DashboardBasicStats>
    <DashboardBackupStats></DashboardBackupStats>
  </div>
</template>

<script setup lang="ts">
import {
  faArrowUpRightFromSquare,
  faClock,
  faClockRotateLeft,
  faFloppyDisk,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import DashboardBasicStats from '@velero-ui-app/components/Dashboard/DashboardBasicStats.vue';
import DashboardBackupStats from "@velero-ui-app/components/Dashboard/DashboardBackupsStats.vue";
</script>
