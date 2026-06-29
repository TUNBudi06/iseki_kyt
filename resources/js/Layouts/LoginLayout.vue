<script setup>
import { Head } from '@inertiajs/vue3'
import DefaultLayout from '@/Layouts/DefaultLayout.vue'
</script>

<template>
  <Head>
    <title>Iseki KYT | Login</title>
    <meta name="description" content="Login to Your Account to produce kyt" />
  </Head>

  <DefaultLayout>
    <div class="min-h-screen flex items-center justify-center px-4">
      <slot />
    </div>
  </DefaultLayout>
</template>
