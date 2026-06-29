<script setup>
import '../../css/app.css'
import { Toaster } from 'vue-sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
</script>

<template>
  <Toaster position="top-right" rich-colors />
  <TooltipProvider>
    <slot />
  </TooltipProvider>
</template>
