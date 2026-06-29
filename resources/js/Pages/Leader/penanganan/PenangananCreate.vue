<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Canvas, Circle, FabricImage, Rect } from 'fabric'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import LeaderLayout from '@/Layouts/LeaderLayout.vue'
import { useForm, Head } from '@inertiajs/vue3'
import DropZone from '@/Components/DropZone.vue'
import { assetUrl, route } from '@tunbudi06/inertia-route-helper'
import { maxChartTitleLength } from '$/Pages/Leader/KytParameter.ts'
import { toBlob } from 'html-to-image'
import { penangananstore } from '$routes/leader'
import { toast } from 'vue-sonner'

const props = defineProps({ kyt: { type: Object, default: null } })

const form = useForm({
  title: '',
  kyt_list_id: 0,
  foto_path: null,
  result_path: null,
})

const canvasEl = ref(null)
const previewContainerEl = ref(null)
let canvas = null
const history = ref([])
const redoStack = ref([])
const isLoadingState = ref(false)
const cropRect = ref(null)
const penangananUrlImage = ref('')
const strokeSize = ref(4)

function saveState() {
  if (!canvas || isLoadingState.value) return
  const j = JSON.stringify(canvas.toJSON())
  history.value = [...history.value, j]
  if (history.value.length > 30) history.value = history.value.slice(1)
  redoStack.value = []
}

function undo() {
  if (!canvas || history.value.length === 0) return
  isLoadingState.value = true
  redoStack.value = [...redoStack.value, JSON.stringify(canvas.toJSON())]
  const ps = history.value.pop()
  canvas.loadFromJSON(JSON.parse(ps)).then(() => { canvas.renderAll(); isLoadingState.value = false })
}

function redo() {
  if (!canvas || redoStack.value.length === 0) return
  isLoadingState.value = true
  history.value = [...history.value, JSON.stringify(canvas.toJSON())]
  const ns = redoStack.value.pop()
  canvas.loadFromJSON(JSON.parse(ns)).then(() => { canvas.renderAll(); isLoadingState.value = false })
}

onMounted(() => {
  form.kyt_list_id = props.kyt?.id || 0
  if (!canvasEl.value) return
  canvas = new Canvas(canvasEl.value, { selection: true, preserveObjectStacking: true })
  canvas.setDimensions({ width: 1200, height: 600 })
  history.value = [JSON.stringify(canvas.toJSON())]
  canvas.on('object:added', () => { if (!isLoadingState.value) saveState() })
  canvas.on('object:modified', () => { if (!isLoadingState.value) saveState() })
  canvas.on('object:removed', () => { if (!isLoadingState.value) saveState() })
})

onUnmounted(() => canvas?.dispose())

function loadImage(file) {
  if (!file || !canvas) return
  const reader = new FileReader()
  reader.onload = () => {
    FabricImage.fromURL(reader.result).then((img) => {
      const cw = canvas.getWidth(); const ch = canvas.getHeight()
      const sc = Math.min(cw / (img.width || 1), ch / (img.height || 1))
      img.set({ originX: 'left', originY: 'top', scaleX: sc, scaleY: sc, left: (cw - (img.width || 0) * sc) / 2, top: (ch - (img.height || 0) * sc) / 2, hasControls: true, selectable: true, evented: true, hasBorders: true })
      img.setCoords()
      canvas.add(img); canvas.setActiveObject(img); canvas.renderAll(); saveState()
    })
  }
  reader.readAsDataURL(file)
}

function handleFilesSelect(e) { e.acceptedFiles.forEach(f => loadImage(f)) }

function addHighlightRed() { if (canvas) canvas.add(new Rect({ left: 100, top: 100, width: 120, height: 60, fill: 'transparent', stroke: '#EF4444', strokeWidth: strokeSize.value, cornerColor: '#EF4444' })) }
function addHighlightYellow() { if (canvas) canvas.add(new Rect({ left: 100, top: 100, width: 120, height: 60, fill: 'transparent', stroke: '#FACC15', strokeWidth: strokeSize.value, cornerColor: '#FACC15' })) }
function addCircle() { if (canvas) canvas.add(new Circle({ left: 150, top: 150, radius: 40, fill: 'transparent', stroke: 'red', strokeWidth: strokeSize.value })) }
function removeSelected() { if (canvas) { const o = canvas.getActiveObject(); if (o) { canvas.remove(o); saveState() } } }
function bringToFront() { if (canvas) { const o = canvas.getActiveObject(); if (o) { canvas.bringObjectToFront(o); canvas.renderAll(); saveState() } } }
function bringForward() { if (canvas) { const o = canvas.getActiveObject(); if (o) { canvas.bringObjectForward(o); canvas.renderAll(); saveState() } } }
function sendBackward() { if (canvas) { const o = canvas.getActiveObject(); if (o) { canvas.sendObjectBackwards(o); canvas.renderAll(); saveState() } } }
function sendToBack() { if (canvas) { const o = canvas.getActiveObject(); if (o) { canvas.sendObjectToBack(o); canvas.renderAll(); saveState() } } }

function startCrop() {
  if (cropRect.value || !canvas) return
  const cw = canvas.getWidth(); const ch = canvas.getHeight()
  const rect = new Rect({ left: (cw - 300) / 2, top: (ch - 200) / 2, width: 300, height: 200, fill: 'rgba(0,0,0,0.5)', stroke: '#FFFFFF', strokeWidth: 3, strokeDashArray: [10, 5], hasRotatingPoint: false, cornerColor: '#FFFFFF', cornerSize: 12, transparentCorners: false, cornerStrokeColor: '#000000', borderColor: '#FFFFFF' })
  canvas.add(rect); canvas.bringObjectToFront(rect); canvas.setActiveObject(rect); canvas.renderAll()
  cropRect.value = rect
}

function applyCrop() {
  if (!cropRect.value || !canvas) return
  const r = cropRect.value.getBoundingRect()
  const objs = canvas.getObjects().filter(o => o !== cropRect.value)
  const rm = []
  objs.forEach(o => { const b = o.getBoundingRect(); if (!(b.left + b.width < r.left || b.left > r.left + r.width || b.top + b.height < r.top || b.top > r.top + r.height)) rm.push(o) })
  canvas.remove(cropRect.value); cropRect.value = null; canvas.renderAll()
  const du = canvas.toDataURL({ left: r.left, top: r.top, width: r.width, height: r.height, multiplier: 1, format: 'png' })
  rm.forEach(o => canvas.remove(o))
  FabricImage.fromURL(du).then((img) => {
    const cw = canvas.getWidth(); const ch = canvas.getHeight(); const sc = Math.min(cw / (img.width || 1), ch / (img.height || 1), 1)
    img.set({ originX: 'left', originY: 'top', scaleX: sc, scaleY: sc, left: (cw - (img.width || 0) * sc) / 2, top: (ch - (img.height || 0) * sc) / 2, hasControls: true, selectable: true, evented: true, hasBorders: true })
    img.setCoords(); canvas.add(img); canvas.setActiveObject(img); canvas.renderAll(); saveState()
  })
}

async function exportImage() {
  if (!canvas) return
  const blob = await canvas.toBlob({ format: 'png', multiplier: 1, enableRetinaScaling: true })
  if (!blob) return
  form.foto_path = new File([blob], `penanganan-${Date.now()}.png`, { type: 'image/png' })
  penangananUrlImage.value = URL.createObjectURL(blob)
}

async function generatePreviewThumbnail() {
  if (!previewContainerEl.value) return false
  try {
    await new Promise(r => setTimeout(r, 300))
    const imgs = previewContainerEl.value.querySelectorAll('img')
    const orig = new Map()
    for (const img of Array.from(imgs)) {
      if (img.src.startsWith('blob:')) {
        orig.set(img, img.src)
        try { const r = await fetch(img.src); const b = await r.blob(); const du = await new Promise(r => { const fr = new FileReader(); fr.onloadend = () => r(fr.result); fr.readAsDataURL(b) }); img.src = du } catch (e) { console.warn(e) }
      }
    }
    await new Promise(r => setTimeout(r, 100))
    const blob = await toBlob(previewContainerEl.value, { quality: 1.0, pixelRatio: 3, cacheBust: true, skipAutoScale: false, backgroundColor: '#ffffff' })
    for (const [img, src] of orig.entries()) { img.src = src }
    if (!blob) throw new Error('Failed')
    form.result_path = new File([blob], `penanganan-preview-${Date.now()}.png`, { type: 'image/png' })
    return true
  } catch (e) { console.error(e); alert('Gagal membuat preview'); return false }
}

async function submitForm(e) {
  e.preventDefault()
  const ok = await generatePreviewThumbnail()
  if (!ok) return
  form.submit(route(penangananstore()), {
    preserveScroll: true,
    onSuccess: () => toast.success('Penanganan berhasil disimpan!'),
    onError: (err) => console.error(err),
  })
}

function handleKeydown(e) {
  if (!canvas) return
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return }
  if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) { e.preventDefault(); redo(); return }
  if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) { e.preventDefault(); removeSelected(); return }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Head><title>Create Penanganan - Leader Dashboard</title></Head>

  <LeaderLayout>
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-3xl tracking-tight">Tambahkan Penanganan</h3>
        <span class="text-muted-foreground mt-1">Tambahkan penanganan untuk kiken yochi training</span>
      </div>

      <!-- KYT Preview -->
      <Card>
        <CardHeader class="space-y-0">
          <CardTitle class="w-full text-center font-bold text-3xl">Penanganan</CardTitle>
          <CardDescription class="w-full text-center">Berikut adalah preview KYT yang telah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <div class="relative mx-auto max-w-full" style="width: 1280px; height: 680px;">
              <img :src="assetUrl(kyt?.result_path)" alt="KYT Background" class="rounded-lg border border-border object-contain w-full h-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Form -->
      <Card>
        <CardHeader class="space-y-0">
          <CardTitle class="w-full text-center font-bold text-3xl">Form Penanganan</CardTitle>
          <CardDescription class="w-full text-center">Isi form berikut untuk menambahkan penanganan pada KYT</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="title">Masukkan Title: (Optional)
                <span class="text-xs text-muted-foreground ml-2">({{ form.title.length }}/{{ maxChartTitleLength }})</span>
              </Label>
              <Input id="title" v-model="form.title" :maxlength="maxChartTitleLength" placeholder="Masukkan Title" />
            </div>
            <div class="grid gap-2">
              <Label for="foto_path">Upload Gambar Penanganan:</Label>
              <DropZone @drop="handleFilesSelect" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Canvas Editor -->
      <Card>
        <CardContent class="p-4">
          <div class="flex gap-2 pb-4 flex-wrap">
            <div class="flex items-center gap-2">
              <Label for="strokeSize">Stroke Size:</Label>
              <Input id="strokeSize" type="number" min="1" max="20" v-model.number="strokeSize" class="w-20" />
            </div>
            <Button variant="outline" @click="addHighlightRed" class="justify-start"><span class="inline-block w-3 h-3 rounded-sm mr-2 bg-red-500"></span>Highlight Red</Button>
            <Button variant="outline" @click="addHighlightYellow" class="justify-start"><span class="inline-block w-3 h-3 rounded-sm mr-2 bg-yellow-500"></span>Highlight Yellow</Button>
            <Button variant="outline" @click="addCircle" class="justify-start">🔴 Circle</Button>
            <Button variant="outline" @click="removeSelected" class="justify-start">🗑️ Remove Selected</Button>
            <Button variant="outline" @click="bringToFront" class="justify-start">⏫ Bring To Front</Button>
            <Button variant="outline" @click="bringForward" class="justify-start">🔼 Bring Forward</Button>
            <Button variant="outline" @click="sendBackward" class="justify-start">🔽 Send Backward</Button>
            <Button variant="outline" @click="sendToBack" class="justify-start">⏬ Send To Back</Button>
            <Button variant="outline" @click="startCrop" class="justify-start">✂️ Crop</Button>
            <Button variant="outline" @click="applyCrop" class="justify-start">✅ Apply Crop</Button>
          </div>
          <div class="overflow-x-auto overflow-y-hidden bg-muted/30 p-4 rounded-lg touch-pan-x">
            <div class="mx-auto bg-white" style="width: 1200px; height: 600px;">
              <canvas ref="canvasEl" class="border border-border rounded-lg shadow-sm" style="width: 1200px; height: 600px;"></canvas>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" @click="undo" class="flex-1">↩️ Undo</Button>
            <Button variant="outline" @click="redo" class="flex-1">↪️ Redo</Button>
            <Button @click="exportImage" class="flex-1">💾 Lihat Hasil</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Preview -->
      <Card>
        <CardHeader>
          <CardTitle>Kiken Yochi Training - Preview</CardTitle>
          <CardDescription>
            <template v-if="penangananUrlImage">Hasil gambar yang telah disimpan</template>
            <template v-else>Klik "💾 Lihat Hasil" untuk melihat hasil gambar di sini</template>
          </CardDescription>
        </CardHeader>
        <CardContent class="p-4">
          <div class="overflow-x-auto">
            <div ref="previewContainerEl" class="relative mx-auto w-300 h-170 bg-pink-200 border-4 p-2 border-black flex items-center justify-center">
              <template v-if="penangananUrlImage">
                <div class="absolute top-0 left-0 w-full flex items-center max-w-300 justify-center pt-2">
                  <span class="font-bold text-2xl leading-tight text-center text-black uppercase">{{ form.title }}</span>
                </div>
                <div class="absolute inset-0 left-0 top-16 w-300 h-150">
                  <img :src="penangananUrlImage" alt="Hasil editing KYT" class="rounded shadow-lg w-full h-full" />
                </div>
              </template>
              <template v-else>
                <span class="font-bold text-2xl leading-tight text-center max-w-300 text-wrap text-black uppercase">{{ form.title || 'Masukkan judul untuk preview' }}</span>
              </template>
            </div>
          </div>
          <div class="mt-4">
            <Button @click="submitForm" class="w-full" :disabled="form.processing || !form.title">
              <template v-if="form.processing">Menyimpan...</template>
              <template v-else-if="form.title">Simpan Penanganan KYT</template>
              <template v-else>Tambahkan judul terlebih dahulu</template>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </LeaderLayout>
</template>

<style scoped>
canvas { touch-action: none; }
</style>
