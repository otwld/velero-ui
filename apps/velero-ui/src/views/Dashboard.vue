<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900">
    <div class="grid grid-cols-1 px-4 xl:grid-cols-4 xl:gap-4">
      <div class="col-span-full xl:col-auto">
        <div
          class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
        >
          <div
            class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
          >
            <FontAwesomeIcon
              :icon="faFloppyDisk"
              class="w-16 h-16 mr-2 dark:text-white"
            />
            <div class="flex-col">
              <h3 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                170
              </h3>
              <div class="text-gray-500 dark:text-gray-400">Backups</div>
            </div>
          </div>
          <div class="flex self-center">
            <router-link
              :to="Pages.BACKUPS.path"
              type="button"
              title="See"
              class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="w-5 h-5"
              />
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-span-full xl:col-auto">
        <div
          class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
        >
          <div
            class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
          >
            <FontAwesomeIcon
              :icon="faClock"
              class="w-16 h-16 mr-2 dark:text-white"
            />
            <div class="flex-col">
              <h3 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                20
              </h3>
              <div class="text-gray-500 dark:text-gray-400">Schedules</div>
            </div>
          </div>
          <div class="flex self-center">
            <router-link
              :to="Pages.SCHEDULES.path"
              type="button"
              title="See"
              class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="w-5 h-5"
              />
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-span-full xl:col-auto">
        <div
          class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
        >
          <div
            class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
          >
            <FontAwesomeIcon
              :icon="faClockRotateLeft"
              class="w-16 h-16 mr-2 dark:text-white"
            />
            <div class="flex-col">
              <h3 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                0
              </h3>
              <div class="text-gray-500 dark:text-gray-400">Restores</div>
            </div>
          </div>
          <div class="flex self-center">
            <router-link
              :to="Pages.RESTORES.path"
              type="button"
              title="See"
              class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="w-5 h-5"
              />
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-span-full xl:col-auto">
        <div
          class="p-4 mb-4 flex justify-between bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
        >
          <div
            class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4"
          >
            <FontAwesomeIcon
              :icon="faServer"
              class="w-16 h-16 mr-2 dark:text-white"
            />
            <div class="flex-col">
              <h3 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                1
              </h3>
              <div class="text-gray-500 dark:text-gray-400">
                Storage Locations
              </div>
            </div>
          </div>
          <div class="flex self-center">
            <router-link
              :to="Pages.STORAGE_LOCATIONS.path"
              type="button"
              title="See"
              class="inline-flex text-gray-500 p-2 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="w-5 h-5"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
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
</script>
