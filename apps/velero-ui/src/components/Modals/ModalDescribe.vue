<template>
  <div
    class="relative z-10"
  >
    <div
      class="fixed inset-0 bg-gray-500/75 transition-opacity"
    />

    <div class="fixed h-full w-full inset-0 z-10">
      <div
        class="flex h-full items-center justify-center p-4"
      >
        <div class="relative p-4 w-full max-w-4xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div
              class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600"
            >
              <h3
                class="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white"
              >
                {{ t('modal.text.title.manifest') }}
                <span class="font-normal text-sm ml-2">{{ name }}</span>
              </h3>
              <button
                @click="emit('onClose')"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                type="button"
              >
                <FontAwesomeIcon :icon="faXmark" class="!w-5 !h-5" />
              </button>
            </div>
            <div class="p-4 md:p-5">
              <div
                class="p-4 text-sm w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-[600px] overflow-auto"
              >
                <div v-if="data">
                  <p
                    v-for="(line, index) of parseYaml(data)"
                    :key="`line-${index}`"
                    :style="indentYaml(line)"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
            >
              <button
                @click="
                  emit('onConfirm');
                  emit('onClose');
                "
                class="text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {{ t('global.button.close.title') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { PropType } from 'vue';
import { indentYaml, parseYaml } from '@velero-ui-app/utils/yaml.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  name: String,
  data: Object as PropType<any>,
});

const emit = defineEmits(['onConfirm', 'onClose']);
</script>
