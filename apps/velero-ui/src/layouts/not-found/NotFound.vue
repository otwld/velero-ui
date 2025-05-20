<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <h1
          class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-blue-500"
        >
          404
        </h1>
        <p
          class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
        >
          {{ t('notFound.title') }}
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          {{ t('notFound.description') }}
        </p>
        <router-link
          :to="Pages.HOME.path"
          class="inline-flex text-white transition duration-200 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4"
        >
          {{ t('notFound.button.title') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Pages } from '@velero-ui-app/utils/constants.utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
