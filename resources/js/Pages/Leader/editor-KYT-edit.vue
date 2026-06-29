<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Canvas, Circle, FabricImage, Rect } from 'fabric'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import LeaderLayout from '@/Layouts/LeaderLayout.vue'
import { Button } from '@/components/ui/button'
import { useForm, Head } from '@inertiajs/vue3'
import KytPreview from '@/Components/KytPreview.vue'
import DropZone from '@/Components/DropZone.vue'
import { kytupdate } from '$routes/leader'
import { assetUrl, routeUrl } from '@tunbudi06/inertia-route-helper'
import { toBlob } from 'html-to-image'
import { toast } from 'vue-sonner'
import { maxChartTitleLength, maxKeteranganLength, maxPenangananLength, maxPicLength } from './KytParameter.ts'

const props = defineProps({
  bgKyt: { type: String, default: '' },
  kytDate: { type: [String, Date], default: '' },
  kytTeam: { type: String, default: '' },
  kytData: { type: Object, default: null },
})

const dateparams = ref(0)
const canvasEl = ref(null)
const previewContainerEl = ref(null)
let canvas = null
const history = ref([])
const redoStack = ref([])
const isLoadingState = ref(false)
const cropRect = ref(null)
const savedImageUrl = ref('')
const strokeSize = ref(4)

const form = useForm({
  foto_path: null,
  result_path: null,
  penanganan: '',
  potensi: '',
  user_name: '',
  title: '',
})

function saveState() {
  if (!canvas || isLoadingState.value) return
  const json = JSON.stringify(canvas.toJSON())
  history.value = [...history.value, json]
  if (history.value.length > 30) history.value = history.value.slice(1)
  redoStack.value = []
}

function undo() {
  if (!canvas || history.value.length === 0) return
  isLoadingState.value = true
  const cs = JSON.stringify(canvas.toJSON())
  redoStack.value = [...redoStack.value, cs]
  const ps = history.value[history.value.length - 1]
  history.value = history.value.slice(0, -1)
  canvas.loadFromJSON(JSON.parse(ps)).then(() => { canvas.renderAll(); isLoadingState.value = false })
}

function redo() {
  if (!canvas || redoStack.value.length === 0) return
  isLoadingState.value = true
  const cs = JSON.stringify(canvas.toJSON())
  history.value = [...history.value, cs]
  const ns = redoStack.value[redoStack.value.length - 1]
  redoStack.value = redoStack.value.slice(0, -1)
  canvas.loadFromJSON(JSON.parse(ns)).then(() => { canvas.renderAll(); isLoadingState.value = false })
}

onMounted(() => {
  dateparams.value = Date.now()
  form.penanganan = props.kytData?.penanganan || ''
  form.potensi = props.kytData?.potensi || ''
  form.user_name = props.kytData?.user_name || ''
  form.title = props.kytData?.title || ''
  savedImageUrl.value = assetUrl(props.kytData?.foto_path || '', { query: { t: dateparams.value } })

  if (!canvasEl.value) return
  canvas = new Canvas(canvasEl.value, { selection: true, preserveObjectStacking: true })
  canvas.setDimensions({ width: 680, height: 500 })
  history.value = [JSON.stringify(canvas.toJSON())]
  canvas.on('object:added', () => { if (!isLoadingState.value) saveState() })
  canvas.on('object:modified', () => { if (!isLoadingState.value) saveState() })
  canvas.on('object:removed', () => { if (!isLoadingState.value) saveState() })
})

onUnmounted(() => { canvas?.dispose() })

function loadImage(file) {
  if (!file || !canvas) return
  const reader = new FileReader()
  reader.onload = () => {
    FabricImage.fromURL(reader.result).then((img) => {
      const cw = canvas.getWidth(); const ch = canvas.getHeight()
      const scale = Math.min(cw / (img.width || 1), ch / (img.height || 1))
      img.set({
        originX: 'left', originY: 'top', scaleX: scale, scaleY: scale,
        left: (cw - (img.width || 0) * scale) / 2, top: (ch - (img.height || 0) * scale) / 2,
        hasControls: true, selectable: true, evented: true, hasBorders: true,
      })
      img.setCoords()
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      saveState()
    })
  }
  reader.readAsDataURL(file)
}

function handleFilesSelect(e) { e.acceptedFiles.forEach(f => loadImage(f)) }

function addHighlightRed() {
  if (!canvas) return
  canvas.add(new Rect({ left: 100, top: 100, width: 120, height: 60, fill: 'transparent', stroke: '#EF4444', strokeWidth: strokeSize.value, cornerColor: '#EF4444' }))
}
function addHighlightYellow() {
  if (!canvas) return
  canvas.add(new Rect({ left: 100, top: 100, width: 120, height: 60, fill: 'transparent', stroke: '#FACC15', strokeWidth: strokeSize.value, cornerColor: '#FACC15' }))
}
function addCircle() {
  if (!canvas) return
  canvas.add(new Circle({ left: 150, top: 150, radius: 40, fill: 'transparent', stroke: 'red', strokeWidth: strokeSize.value }))
}
function removeSelected() { if (!canvas) return; const o = canvas.getActiveObject(); if (o) { canvas.remove(o); saveState() } }
function bringToFront() { if (!canvas) return; const o = canvas.getActiveObject(); if (o) { canvas.bringObjectToFront(o); canvas.renderAll(); saveState() } }
function bringForward() { if (!canvas) return; const o = canvas.getActiveObject(); if (o) { canvas.bringObjectForward(o); canvas.renderAll(); saveState() } }
function sendBackward() { if (!canvas) return; const o = canvas.getActiveObject(); if (o) { canvas.sendObjectBackwards(o); canvas.renderAll(); saveState() } }
function sendToBack() { if (!canvas) return; const o = canvas.getActiveObject(); if (o) { canvas.sendObjectToBack(o); canvas.renderAll(); saveState() } }

function startCrop() {
  if (cropRect.value || !canvas) return
  const cw = canvas.getWidth(); const ch = canvas.getHeight()
  const rect = new Rect({ left: (cw - 200) / 2, top: (ch - 150) / 2, width: 200, height: 150, fill: 'rgba(0,0,0,0.5)', stroke: '#FFFFFF', strokeWidth: 3, strokeDashArray: [10, 5], hasRotatingPoint: false, cornerColor: '#FFFFFF', cornerSize: 12, transparentCorners: false, cornerStrokeColor: '#000000', borderColor: '#FFFFFF' })
  canvas.add(rect); canvas.bringObjectToFront(rect); canvas.setActiveObject(rect); canvas.renderAll()
  cropRect.value = rect
}

function applyCrop() {
  if (!cropRect.value || !canvas) return
  const rect = cropRect.value.getBoundingRect()
  const allObjects = canvas.getObjects().filter(obj => obj !== cropRect.value)
  const toRemove = []
  allObjects.forEach(obj => {
    const b = obj.getBoundingRect()
    if (!(b.left + b.width < rect.left || b.left > rect.left + rect.width || b.top + b.height < rect.top || b.top > rect.top + rect.height)) toRemove.push(obj)
  })
  canvas.remove(cropRect.value); cropRect.value = null; canvas.renderAll()
  const du = canvas.toDataURL({ left: rect.left, top: rect.top, width: rect.width, height: rect.height, multiplier: 1, format: 'png' })
  toRemove.forEach(obj => canvas.remove(obj))
  FabricImage.fromURL(du).then((img) => {
    const cw = canvas.getWidth(); const ch = canvas.getHeight()
    const scale = Math.min(cw / (img.width || 1), ch / (img.height || 1), 1)
    img.set({ originX: 'left', originY: 'top', scaleX: scale, scaleY: scale, left: (cw - (img.width || 0) * scale) / 2, top: (ch - (img.height || 0) * scale) / 2, hasControls: true, selectable: true, evented: true, hasBorders: true })
    img.setCoords()
    canvas.add(img); canvas.setActiveObject(img); canvas.renderAll(); saveState()
  })
}

async function exportImage() {
  if (!canvas) return
  const blob = await canvas.toBlob({ format: 'png', multiplier: 1 })
  if (!blob) return
  form.foto_path = new File([blob], `kyt-edited-${Date.now()}.png`, { type: 'image/png' })
  savedImageUrl.value = URL.createObjectURL(blob)
}

async function generatePreviewThumbnail() {
  if (!previewContainerEl.value) return false
  try {
    await new Promise(r => setTimeout(r, 300))
    const images = previewContainerEl.value.querySelectorAll('img')
    const orig = new Map()
    for (const img of Array.from(images)) {
      if (img.src.startsWith('blob:')) {
        orig.set(img, img.src)
        try { const r = await fetch(img.src); const b = await r.blob(); const du = await new Promise(r => { const fr = new FileReader(); fr.onloadend = () => r(fr.result); fr.readAsDataURL(b) }); img.src = du } catch (e) { console.warn(e) }
      }
    }
    await new Promise(r => setTimeout(r, 100))
    const blob = await toBlob(previewContainerEl.value, { quality: 1.0, pixelRatio: 3, cacheBust: true, skipAutoScale: false, backgroundColor: '#ffffff' })
    for (const [img, src] of orig.entries()) { img.src = src }
    if (!blob) throw new Error('Failed')
    form.result_path = new File([blob], `kyt-preview-${Date.now()}.png`, { type: 'image/png' })
    return true
  } catch (e) { console.error(e); alert('Gagal membuat preview'); return false }
}

async function submitKyt() {
  const ok = await generatePreviewThumbnail()
  if (!ok) return
  form.post(routeUrl(kytupdate({ id: props.kytData.id })), {
    preserveScroll: true,
    onSuccess: () => toast.success('KYT berhasil disimpan!'),
    onError: (e) => console.error(e),
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
  <Head><title>Edit KYT - Leader Dashboard</title></Head>

  <LeaderLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Editor KYT</h1>
        <p class="text-muted-foreground mt-1">Edit dan anotasi gambar Kiken Yochi Training</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Toolbar</CardTitle><CardDescription>Upload gambar dan gunakan alat di bawah ini untuk mengedit</CardDescription></CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Judul KYT <span class="text-xs text-muted-foreground ml-2">({{ form.title.length }}/{{ maxChartTitleLength }})</span></label>
              <input v-model="form.title" :maxlength="maxChartTitleLength" placeholder="Masukkan judul KYT..." class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Disampaikan Oleh <span class="text-xs text-muted-foreground ml-2">({{ form.user_name.length }}/{{ maxPicLength }})</span></label>
              <input v-model="form.user_name" :maxlength="maxPicLength" placeholder="Nama penanggung jawab..." class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Potensi Bahaya <span class="text-xs text-muted-foreground ml-2">({{ form.potensi.length }}/{{ maxKeteranganLength }})</span></label>
              <textarea v-model="form.potensi" :maxlength="maxKeteranganLength" rows="4" placeholder="Jelaskan potensi bahaya..." class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Penanganan <span class="text-xs text-muted-foreground ml-2">({{ form.penanganan.length }}/{{ maxPenangananLength }})</span></label>
              <textarea v-model="form.penanganan" :maxlength="maxPenangananLength" rows="4" placeholder="Jelaskan cara penanganan..." class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Ketebalan Garis: ({{ strokeSize }}px)</label>
              <input v-model.number="strokeSize" type="range" min="1" max="20" step="1" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Upload Gambar</label>
              <DropZone @drop="handleFilesSelect" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto] gap-6">
        <Card>
          <CardContent class="p-4">
            <div class="overflow-x-auto overflow-y-hidden bg-muted/30 p-4 rounded-lg touch-pan-x">
              <div class="mx-auto bg-white" style="width: 680px; height: 502px;">
                <canvas ref="canvasEl" class="border border-border rounded-lg shadow-sm" style="width: 680px; height: 502px;"></canvas>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="lg:w-64">
          <CardHeader><CardTitle class="text-base">Drawing Tools</CardTitle><CardDescription class="text-xs">Tools untuk menggambar dan mengatur</CardDescription></CardHeader>
          <CardContent>
            <div class="flex flex-col gap-2">
              <Button variant="outline" @click="addHighlightRed" class="justify-start"><span class="inline-block w-3 h-3 rounded-sm mr-2 bg-red-500"></span>Highlight Red</Button>
              <Button variant="outline" @click="addHighlightYellow" class="justify-start"><span class="inline-block w-3 h-3 rounded-sm mr-2 bg-yellow-500"></span>Highlight Yellow</Button>
              <Button variant="outline" @click="addCircle" class="justify-start">🔴 Circle</Button>
              <Button variant="outline" @click="removeSelected" class="justify-start">🗑️ Remove Selected</Button>
              <div class="border-t border-border my-2"></div>
              <Button variant="outline" @click="bringToFront" class="justify-start">⏫ Bring To Front</Button>
              <Button variant="outline" @click="bringForward" class="justify-start">🔼 Bring Forward</Button>
              <Button variant="outline" @click="sendBackward" class="justify-start">🔽 Send Backward</Button>
              <Button variant="outline" @click="sendToBack" class="justify-start">⏬ Send To Back</Button>
              <div class="border-t border-border my-2"></div>
              <Button variant="outline" @click="startCrop" class="justify-start">✂️ Crop</Button>
              <Button variant="outline" @click="applyCrop" class="justify-start">✅ Apply Crop</Button>
            </div>
          </CardContent>
        </Card>

        <Card class="lg:col-span-2 xl:col-span-1 xl:w-64">
          <CardHeader><CardTitle class="text-base">Actions</CardTitle><CardDescription class="text-xs">Undo, Redo, dan Simpan</CardDescription></CardHeader>
          <CardContent>
            <div class="flex flex-col gap-2">
              <Button variant="outline" @click="undo" class="flex-1">↩️ Undo</Button>
              <Button variant="outline" @click="redo" class="flex-1">↪️ Redo</Button>
              <Button @click="exportImage" class="flex-1">💾 Tambah Foto</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kiken Yochi Training - Preview</CardTitle>
          <CardDescription>
            <template v-if="savedImageUrl">Hasil gambar yang telah disimpan</template>
            <template v-else>Klik "💾 Tambah Foto" untuk melihat hasil</template>
          </CardDescription>
        </CardHeader>
        <CardContent class="p-4">
          <div class="overflow-x-auto">
            <KytPreview
              v-model:element-id="previewContainerEl"
              :bg-kyt="bgKyt"
              :kyt-date="kytDate"
              :kyt-team="kytTeam"
              :kyt-title="form.title"
              :saved-image-url="savedImageUrl"
              :kyt-pic="form.user_name"
              :kyt-potensi="form.potensi"
              :kyt-penanganan="form.penanganan"
            />
          </div>
          <div class="mt-4">
            <Button @click="submitKyt" class="w-full" :disabled="form.processing">
              {{ form.processing ? 'Menyimpan...' : 'Simpan KYT' }}
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
