<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid'
</script>
<template>
  <main
    class="w-full h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 sm:border-x border-neutral-800 pt-10">
    <div class="flex justify-end">
      <button type="button"
              class="rounded-full bg-indigo-600 p-2 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500">
        <PlusIcon class="size-5" aria-hidden="true" />
      </button>

    </div>
    <div class="text-center">
      <h1
        class="tracking-tight font-bold text-pretty text-3xl sm:text-4xl lg:text-5xl text-shadow-md max-w-lg mx-auto">
        Hey, I'm Daniël
      </h1>
      <h2 class="tracking-tight font-bold text-pretty text-3xl sm:text-4xl lg:text-5xl text-shadow-md max-w-lg mx-auto">
        Data engineer
      </h2>

    </div>
  </main>
</template>
