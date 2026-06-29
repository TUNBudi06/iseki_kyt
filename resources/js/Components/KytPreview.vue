<script setup>
import { ref, watchEffect, onUnmounted } from 'vue'

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

const NATIVE_W = 1280
const NATIVE_H = 720

const containerEl = ref(null)
const scale = ref(1)

let observer = null

watchEffect(() => {
  if (!props.scaleToFit || !containerEl.value) {
    observer?.disconnect()
    observer = null
    return
  }

  observer = new ResizeObserver((entries) => {
    const w = entries[0].contentRect.width
    scale.value = Math.min(w / NATIVE_W, 1)
  })
  observer.observe(containerEl.value)
})

onUnmounted(() => {
  observer?.disconnect()
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
    ref="containerEl"
    class="kytp-root"
    :class="scaleToFit ? 'kytp-scale' : 'kytp-native'"
  >
    <div class="kytp-inner">
      <div
        class="kytp-content"
        :style="{
          width: NATIVE_W + 'px',
          height: NATIVE_H + 'px',
          transform: 'scale(' + scale + ')',
        }"
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
}
.kytp-root.kytp-native {
  width: 1280px;
}
.kytp-root.kytp-scale {
  width: 100%;
  overflow: hidden;
  aspect-ratio: 1280 / 720;
}
.kytp-root.kytp-scale .kytp-inner {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.kytp-root.kytp-native .kytp-inner {
  /* normal flow */
}
.kytp-content {
  position: relative;
  transform-origin: top left;
}
</style>
