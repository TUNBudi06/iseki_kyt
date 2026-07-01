<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { EL, elPxStyle } from '$lib/kytDimensions.ts'

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
const kytpScale = ref(typeof window !== 'undefined' ? Math.min((window.innerWidth - 48) / 1280, 1) : 1)

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  if (!props.scaleToFit) return
  await nextTick()
  requestAnimationFrame(() => {
    if (rootRef.value) {
      const w = rootRef.value.getBoundingClientRect().width
      if (w > 0) kytpScale.value = Math.min(w / 1280, 1)
    }
  })
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
    <div class="kytp-inner" :style="scaleToFit ? { zoom: kytpScale, width: '1280px', height: '720px' } : {}">
      <div
        class="kytp-content"
        :ref="(el) => { if (el && elementId !== undefined) elementId = el }"
      >
        <img
          :src="bgKyt"
          alt="KYT Background"
          class="absolute inset-0 w-full h-full rounded-lg border border-border object-contain"
        />

        <div v-if="kytTeam" :style="elPxStyle(EL.team)" class="absolute text-center" style="color: #404040; text-shadow: 2.5px 2.5px 3px rgba(0, 0, 0, 0.4);">
          <span class="font-bold leading-tight">
            {{ kytTeam }}
          </span>
        </div>

        <div v-if="kytTitle" :style="elPxStyle(EL.title)" class="absolute flex items-center justify-center">
          <span class="font-bold leading-tight text-center text-black uppercase">
            {{ kytTitle }}
          </span>
        </div>

        <div v-if="savedImageUrl" :style="elPxStyle(EL.image)" class="absolute">
          <img
            :src="savedImageUrl"
            alt="Hasil editing KYT"
            class="w-full h-full rounded shadow-lg object-contain"
          />
        </div>
        <div v-else class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-muted-foreground bg-white/80 p-4 rounded-lg">
            <p class="text-sm font-medium">Belum ada gambar tersimpan</p>
            <p class="text-xs mt-1">Upload dan edit gambar, lalu klik Save</p>
          </div>
        </div>

        <div :style="elPxStyle(EL.date)" class="absolute text-right" style="color: #2F5597; text-shadow: 2.5px 2.5px 3px rgba(0, 0, 0, 0.4);">
          <span class="font-bold leading-tight">
            {{ formattedDate(kytDate) }}
          </span>
        </div>

        <template v-if="kytPic">
          <div :style="elPxStyle(EL.picLabel)" class="absolute" style="color: #FF0000;">
            <span class="font-bold leading-tight">
              DISAMPAIKAN OLEH :
            </span>
          </div>
          <div :style="elPxStyle(EL.picValue)" class="absolute" style="color: #000000;">
            <span class="font-bold leading-tight">{{ kytPic }}</span>
          </div>
        </template>

        <template v-if="kytPotensi">
          <div :style="elPxStyle(EL.potLabel)" class="absolute" style="color: #FF0000;">
            <span class="font-bold leading-tight">
              POTENSI BAHAYA :
            </span>
          </div>
          <div :style="elPxStyle(EL.potValue)" class="absolute overflow-hidden">
            <p class="leading-snug text-black whitespace-pre-wrap break-words">
              {{ kytPotensi }}
            </p>
          </div>
        </template>

        <template v-if="kytPenanganan">
          <div :style="elPxStyle(EL.penLabel)" class="absolute" style="color: #FF0000;">
            <span class="font-bold leading-tight">
              PENANGANAN :
            </span>
          </div>
          <div :style="elPxStyle(EL.penValue)" class="absolute overflow-hidden">
            <p class="leading-snug text-black whitespace-pre-wrap break-words">
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