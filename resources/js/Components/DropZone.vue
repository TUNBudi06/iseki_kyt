<script setup>
import { ref } from 'vue'

const emit = defineEmits(['drop'])
const fileInput = ref(null)
const isDragging = ref(false)

function openFileDialog() {
  fileInput.value?.click()
}

function onFileSelect(e) {
  const files = Array.from(e.target.files || [])
  if (files.length) emit('drop', { acceptedFiles: files })
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'))
  if (files.length) emit('drop', { acceptedFiles: files })
}
</script>

<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-400 transition-colors"
    :class="{ 'border-pink-500 bg-pink-50': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="openFileDialog"
  >
    <input ref="fileInput" type="file" hidden multiple accept="image/*" @change="onFileSelect" />
    <p class="text-sm text-muted-foreground">
      Drag & drop images here, or click to select
    </p>
  </div>
</template>
