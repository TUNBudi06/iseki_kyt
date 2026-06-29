<script setup lang="ts">
defineProps({
  title: { type: String, default: 'The GodFather' },
  desc: { type: String, default: '' },
  class: { type: String, default: '' },
})
</script>

<template>
  <div :class="'px-2 text-gray-100 sm:px-4 py-0 sm:pb-3 text-left ' + (class || '')">
    <h3 class="text-lg font-bold tracking-tighter mt-3 mb-1">{{ title }}</h3>
    <p class="text-sm leading-5">{{ desc }}</p>
  </div>
</template>
