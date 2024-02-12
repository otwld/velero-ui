<template class="">
  <div class="flex justify-center w-full">
    <div class="w-xl">
      <!-- Modal body -->
      <ol
        class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
      >
        <li
          class="flex md:w-full items-center text-blue-600 dark:text-blue-500 "
        >
          <span
            class="flex items-center"
          >
            <svg
              class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              />
            </svg>
            Personal <span class="hidden sm:inline-flex sm:mr-2">Info</span>
          </span>
        </li>
        <li
          class="flex md:w-full items-center "
        >
          <span
            class="flex items-center"
          >
            <span class="mr-2">2</span>
            Account <span class="hidden sm:inline-flex sm:mr-2">Info</span>
          </span>
        </li>
        <li class="flex items-center">
          <span class="mr-2">3</span>
          Confirmation
        </li>
      </ol>
      <div class="p-4 md:p-5">
        <p class="text-gray-500 dark:text-gray-400 mb-4">Type of backup:</p>
        <ul class="space-y-4 mb-4">
          <li>
            <input
              type="radio"
              id="job-1"
              name="job"
              value="job-1"
              class="hidden peer"
              required
            />
            <label
              for="job-1"
              class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <div class="block">
                <div class="w-full text-lg font-semibold">From a schedule</div>
                <div class="w-full text-gray-500 dark:text-gray-400">
                  Use a existing schedule as template
                </div>
              </div>
              <svg
                class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="job-2"
              name="job"
              value="job-2"
              class="hidden peer"
            />
            <label
              for="job-2"
              class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <div class="block">
                <div class="w-full text-lg font-semibold">From scratch</div>
                <div class="w-full text-gray-500 dark:text-gray-400">
                  Create your own template
                </div>
              </div>
              <svg
                class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </label>
          </li>
        </ul>
        <button
          class="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Next step
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
