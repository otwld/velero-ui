<template>
  <div
    class="h-full text-sm text-white bg-gray-900 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-white overflow-auto"
  >
    <table
      class="min-w-full text-sm text-left text-white bg-gray-900 font-mono"
    >
      <thead class="sticky top-0 bg-gray-800 text-xs uppercase text-gray-400">
        <tr>
          <template v-if="!displayRawView">
            <th class="px-4 py-2 w-[130px]">
              {{ t('log.table.header.time') }}
            </th>
            <th class="px-4 py-2 w-[90px]">
              {{ t('log.table.header.level') }}
            </th>
          </template>
          <th class="px-4 py-2 flex justify-between items-center">
            <template v-if="!displayRawView"
              >{{ t('log.table.header.message') }}
            </template>
            <template v-else>
              <div class="flex items-center gap-1">
                <input
                  v-model="searchTerm"
                  :placeholder="t('log.search.placeholder')"
                  class="text-xs bg-gray-800 border border-gray-600 placeholder-gray-500 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-[160px]"
                  type="text"
                  @keyup.enter="nextMatch()"
                />
                <button
                  :disabled="activeIndex === 0"
                  class="px-1 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                  @click="prevMatch"
                >
                  ←
                </button>
                <button
                  :disabled="activeIndex >= totalMatches - 1"
                  class="px-1 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                  @click="nextMatch"
                >
                  →
                </button>
                <span v-if="searchTerm" class="text-gray-400 text-xs">
                  {{ activeIndex + 1 }}/{{ totalMatches }}
                </span>
              </div>
            </template>
            <div class="space-x-2">
              <div class="inline-flex rounded-md">
                <button
                  :class="
                    displayRawView
                      ? 'text-gray-300 hover:text-white'
                      : 'bg-gray-700 text-white border-gray-500'
                  "
                  class="inline-flex items-center text-gray-300 hover:text-white text-xs border border-gray-600 rounded-s-lg px-2 py-1 transition duration-200"
                  type="button"
                  @click="displayRawView = false"
                >
                  <FontAwesomeIcon :icon="faTable" class="!w-4 !h-4 mr-1.5" />
                  {{ t('global.button.tableView.title') }}
                </button>
                <button
                  :class="
                    displayRawView
                      ? 'bg-gray-700 text-white border-gray-500'
                      : 'text-gray-300 hover:text-white'
                  "
                  class="inline-flex items-center text-gray-300 hover:text-white text-xs border border-gray-600 rounded-e-lg px-2 py-1 transition duration-200"
                  type="button"
                  @click="displayRawView = true"
                >
                  <FontAwesomeIcon :icon="faBars" class="!w-4 !h-4 mr-1.5" />
                  {{ t('global.button.rawView.title') }}
                </button>
              </div>
              <div class="inline-flex rounded-md">
                <button
                  v-copy-to-clipboard="toRaw()"
                  class="inline-flex items-center text-gray-300 hover:text-white text-xs border border-gray-600 rounded-s-lg px-2 py-1 transition duration-200"
                  type="button"
                  data-tooltip-target="tooltip-button-copy"
                >
                  <FontAwesomeIcon :icon="faCopy" class="!w-4 !h-4" />
                </button>
                <button
                  v-download="{
                    content: toRaw(),
                    filename: `logs.txt`,
                  }"
                  class="inline-flex items-center text-gray-300 hover:text-white text-xs border border-gray-600 rounded-e-lg px-2 py-1 transition duration-200"
                  type="button"
                  data-tooltip-target="tooltip-button-download"
                >
                  <FontAwesomeIcon
                    :icon="faFileArrowDown"
                    class="!w-4 !h-4"
                  />
                </button>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(line, index) in data"
          :id="`log-line-${index}`"
          :key="`line-${index}`"
          :class="displayRawView ? '' : 'border-t border-gray-700'"
        >
          <template v-if="displayRawView">
            <td
              :class="
                matchIndexes.includes(index) &&
                index === matchIndexes[activeIndex]
                  ? 'bg-gray-700'
                  : ''
              "
              class="px-2 py-1 font-mono whitespace-pre-wrap text-white text-sm"
              v-html="highlight(line.raw, searchTerm)"
            />
          </template>
          <template v-else>
            <td class="px-4 py-1 whitespace-nowrap text-gray-400">
              {{ convertTimestampToDate(line.date) }}
            </td>
            <td class="px-4 py-1">
              <span
                :class="levelColor(line.level)"
                class="capitalize w-[70px] text-center px-2 py-0.5 rounded text-xs font-semibold inline-block"
              >
                {{ line.level }}
              </span>
            </td>
            <td class="px-4 py-1 text-white">
              <LogMessage :line="line"/>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="inline-flex items-center text-gray-400 p-4">
      <FontAwesomeIcon :icon="faCircleNotch" class="!w-4 !h-4 animate-spin" />
      <p class="ml-2">
        {{ t('log.text.loading') }}
      </p>
    </div>
    <div
      v-if="data?.length === 0 && !loading"
      class="inline-flex items-center text-gray-400 p-4"
    >
      <p>
        {{ t('log.text.noResult') }}
      </p>
    </div>
  </div>
  <div
    id="tooltip-button-copy"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.copy.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
  <div
    id="tooltip-button-download"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    role="tooltip"
  >
    {{ t('global.button.download.title') }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import {
  faBars,
  faCircleNotch,
  faCopy,
  faFileArrowDown,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, nextTick, onMounted, type PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Log, type VeleroLog } from '@velero-ui/shared-types';
import { convertTimestampToDate } from '@velero-ui-app/utils/date.utils';
import { initTooltips } from "flowbite";
import LogMessage from "@velero-ui-app/components/Log/LogMessage.vue";

const props = defineProps({
  data: { type: Array as PropType<VeleroLog[]>, required: true },
  loading: { type: Boolean, required: false, default: false },
});

const { t } = useI18n();
const displayRawView = ref(false);
const searchTerm = ref('');
const activeIndex = ref(0);

const totalMatches = computed(() => matchIndexes.value.length);

onMounted(() => initTooltips());

const levelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'info':
      return 'bg-blue-600 text-white';
    case 'warn':
    case 'warning':
      return 'bg-yellow-500 text-black';
    case 'error':
      return 'bg-red-600 text-white';
    case 'debug':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-700 text-white';
  }
};

const highlight = (text: string, keyword: string) => {
  if (!keyword || keyword.length === 0) {
    return text;
  }
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(
    regex,
    '<mark class="bg-yellow-500 text-black">$1</mark>'
  );
};

const matchIndexes = computed(() =>
  props.data
    ?.map((log, i) =>
      log.raw.toLowerCase().includes(searchTerm.value.toLowerCase()) ? i : -1
    )
    .filter((i) => i !== -1)
);

const scrollToActive = () => {
  nextTick(() => {
    const matchIndex = matchIndexes.value[activeIndex.value];
    if (matchIndex !== undefined) {
      const el = document.getElementById(`log-line-${matchIndex}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
};

const nextMatch = () => {
  if (activeIndex.value < matchIndexes.value.length - 1) {
    activeIndex.value++;
  } else {
    activeIndex.value = 0;
  }
  scrollToActive();
};

const prevMatch = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  }
};

const toRaw = (): string[] => props.data.map((line: Log) => `${line.raw}\n`)
</script>
