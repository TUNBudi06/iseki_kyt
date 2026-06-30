<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  bgKyt: { type: String, default: '' },
  kytDate: { type: [String, Date], default: '' },
  kytTeam: { type: String, default: '' },
  kytTitle: { type: String, default: '' },
  savedImageUrl: { type: String, default: '' },
  kytPic: { type: String, default: '' },
  kytPotensi: { type: String, default: '' },
  kytPenanganan: { type: String, default: '' },
  scaleToFit: { type: Boolean, default: false },
})

const elementId = defineModel('elementId')
const rootRef = ref<HTMLElement | null>(null)
const kytpScale = ref(1)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!props.scaleToFit) return
  if (rootRef.value) {
    const w = rootRef.value.getBoundingClientRect().width
    if (w > 0) kytpScale.value = Math.min(w / 1280, 1)
  }
  resizeObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width
    if (w) kytpScale.value = Math.min(w / 1280, 1)
  })
  if (rootRef.value) resizeObserver.observe(rootRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

function formattedDate(dateVal) {
  if (!dateVal) return ''
  const d = new Date(dateVal)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div
    ref="rootRef"
    class="kytp-root"
    :class="scaleToFit ? 'kytp-scale' : 'kytp-native'"
    :style="scaleToFit ? { height: (720 * kytpScale) + 'px' } : {}"
  >
    <div class="kytp-inner" :style="scaleToFit ? { transform: 'scale(' + kytpScale + ')', transformOrigin: 'top left', width: '1280px', height: '720px' } : {}">
      <div
        class="kytp-content"
        :ref="(el) => { if (el && elementId !== undefined) elementId = el }"
      >
        <!-- Background KYT Image -->
        <img
          :src="bgKyt"
          alt="KYT Background"
          class="rounded-lg border border-border object-contain w-full h-full"
        />

        <!-- Team Name -->
        <div v-if="kytTeam" class="absolute left-187.5 top-0 w-132.5 h-2.5 text-center">
          <span
            class="font-bold text-3xl leading-tight"
            style="color: #404040; text-shadow: 2.5px 2.5px 3px rgba(0, 0, 0, 0.4);"
          >
            {{ kytTeam }}
          </span>
        </div>

        <!-- Title -->
        <div v-if="kytTitle" class="absolute left-12.5 top-20 w-170 h-12.5 flex items-center justify-center">
          <span
            class="font-bold text-xl tracking-tight leading-tight text-center text-black uppercase"
          >
            {{ kytTitle }}
          </span>
        </div>

        <!-- Saved Image or Placeholder -->
        <div v-if="savedImageUrl" class="absolute left-12.5 top-33.25 w-170 h-125.5">
          <img
            :src="savedImageUrl"
            alt="Hasil editing KYT"
            class="rounded shadow-lg object-contain w-full h-full"
          />
        </div>
        <div v-else class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-muted-foreground bg-white/80 p-4 rounded-lg">
            <p class="text-sm font-medium">Belum ada gambar tersimpan</p>
            <p class="text-xs mt-1">Upload dan edit gambar, lalu klik Save</p>
          </div>
        </div>

        <!-- Date -->
        <div class="absolute right-16.5 bottom-2 w-120 h-15 text-right">
          <span
            class="font-bold text-5xl leading-tight"
            style="color: #2F5597; text-shadow: 2.5px 2.5px 3px rgba(0, 0, 0, 0.4);"
          >
            {{ formattedDate(kytDate) }}
          </span>
        </div>

        <!-- PIC Label and Value -->
        <template v-if="kytPic">
          <div class="absolute left-200 top-25 w-107.5 h-8.75">
            <span class="font-bold text-3xl leading-tight" style="color: #FF0000;">
              DISAMPAIKAN OLEH :
            </span>
          </div>
          <div class="absolute left-200 top-32.25 w-107.5 h-10">
            <span class="text-3xl leading-tight text-black">{{ kytPic }}</span>
          </div>
        </template>

        <!-- Potensi Bahaya -->
        <template v-if="kytPotensi">
          <div class="absolute left-200 top-45 w-107.5 h-8.75">
            <span class="font-bold text-3xl leading-tight" style="color: #FF0000;">
              POTENSI BAHAYA :
            </span>
          </div>
          <div class="absolute left-200 top-53.25 w-107.5 h-39.5 overflow-hidden">
            <p class="text-2xl leading-snug text-black whitespace-pre-wrap break-words">
              {{ kytPotensi }}
            </p>
          </div>
        </template>

        <!-- Penanganan -->
        <template v-if="kytPenanganan">
          <div class="absolute left-200 top-95 w-107.5 h-8.75">
            <span class="font-bold text-3xl leading-tight" style="color: #FF0000;">
              PENANGANAN :
            </span>
          </div>
          <div class="absolute left-200 top-103.25 w-107.5 h-50.5 overflow-hidden">
            <p class="text-2xl leading-snug text-black whitespace-pre-wrap break-words">
              {{ kytPenanganan }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kytp-root {
  position: relative;
  width: 100%;
}
.kytp-root.kytp-native {
  max-width: 1280px;
  overflow-x: auto;
}
.kytp-root .kytp-inner {
  position: relative;
  width: 1280px;
  height: 720px;
  overflow: hidden;
}
.kytp-content {
  position: relative;
  width: 1280px;
  height: 720px;
}
</style>
