<template>
  <div class="mb-4 text-gray-900 dark:text-white">
    <div class="flex flex-wrap items-center gap-2 font-semibold">
      <span>{{ snapshot.namespace ? `${snapshot.namespace}/` : ''
      }}{{ snapshot.volume || snapshot.name }}</span>
      <Badge
        :text="`${snapshot.type} ${t('podVolumes.snapshot')}`"
        color="blue"
      />
      <Badge
        :text="t(`resource.phase.${snapshot.phase}`)"
        :color="
          snapshot.phase === 'Failed'
            ? 'red'
            : snapshot.phase === 'Completed'
              ? 'green'
              : 'yellow'
        "
      />
    </div>
    <p class="text-sm break-all text-gray-500 dark:text-gray-400">
      {{ snapshot.name }}
    </p>
    <p v-if="snapshot.snapshotID" class="text-sm break-all">
      {{ t('podVolumes.snapshotID') }}: {{ snapshot.snapshotID }}
    </p>
    <p v-if="snapshot.contentName" class="text-sm break-all">
      {{ t('podVolumes.snapshotContent') }}: {{ snapshot.contentName }}
    </p>
    <p v-if="snapshot.driver" class="text-sm">
      {{ t('podVolumes.driver') }}: {{ snapshot.driver }}
    </p>
    <p v-if="snapshot.size !== undefined" class="text-sm">
      {{ t('resource.status.bytes') }}: {{ convertBytes(snapshot.size) }}
    </p>
    <p v-if="snapshot.message" class="text-sm text-red-600 dark:text-red-400">
      {{ snapshot.message }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { BackupSnapshot } from '@velero-ui/velero';
import Badge from '@velero-ui-app/components/Badge.vue';
import { convertBytes } from '@velero-ui-app/utils/string.utils';

defineProps<{ snapshot: BackupSnapshot }>();
const { t } = useI18n();
</script>
