<template>
  <PodVolumeResource :key="route.fullPath" />
</template>
<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { Action } from '@velero-ui/shared-types';
import { resourceGuard } from '@velero-ui-app/utils/guard.utils';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { podVolumeResourceForRoute } from '@velero-ui-app/utils/pod-volume-list.utils';
import PodVolumeResource from '@velero-ui-app/components/PodVolume/PodVolumeResource.vue';

const route = useRoute();
onBeforeRouteUpdate((to) => {
  const resource = podVolumeResourceForRoute(
    to.name === Pages.POD_VOLUME_BACKUP.name,
    to.query.resource as string
  );
  return resource
    ? resourceGuard(Action.Read, resource.plural)
    : { name: Pages.HOME.name };
});
</script>
