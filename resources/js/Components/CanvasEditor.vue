<script setup lang="ts">
/**
 * Reusable Canvas Editor Component
 * Provides fabric.js canvas with drawing tools, undo/redo, crop, image loading
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { Canvas, Circle, FabricImage, Rect } from 'fabric'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = withDefaults(defineProps<{
  canvasWidth?: number
  canvasHeight?: number
  maxHistory?: number
  showToolbar?: boolean
  initialImage?: string
}>(), {
  canvasWidth: 680,
  canvasHeight: 500,
  maxHistory: 30,
  showToolbar: true,
  initialImage: '',
})

const emit = defineEmits<{
  (e: 'canvasReady', canvas: Canvas): void
  (e: 'imageLoaded', file: File): void
  (e: 'exported', blob: Blob): void
}>()

// ---- Canvas state ----
const canvasEl = ref<HTMLCanvasElement | null>(null)
const previewContainerEl = ref<HTMLElement | null>(null)
let canvas: Canvas | null = null
const history = ref<string[]>([])
const redoStack = ref<string[]>([])
const isLoadingState = ref(false)
const cropRect = ref<Rect | null>(null)
const strokeSize = ref(4)

function getCanvas(): Canvas {
  if (!canvas) throw new Error('Canvas not initialized')
  return canvas
}

// ---- Undo / Redo ----
function saveState() {
  const c = getCanvas()
  if (isLoadingState.value) return
  const json = JSON.stringify(c.toJSON())
  history.value = [...history.value, json]
  if (history.value.length > props.maxHistory) history.value = history.value.slice(1)
  redoStack.value = []
}

function undo() {
  const c = getCanvas()
  if (history.value.length === 0) return
  isLoadingState.value = true
  redoStack.value = [...redoStack.value, JSON.stringify(c.toJSON())]
  const previousState = history.value[history.value.length - 1]
  history.value = history.value.slice(0, -1)
  c.loadFromJSON(JSON.parse(previousState)).then(() => {
    c.renderAll()
    isLoadingState.value = false
  })
}

function redo() {
  const c = getCanvas()
  if (redoStack.value.length === 0) return
  isLoadingState.value = true
  history.value = [...history.value, JSON.stringify(c.toJSON())]
  const nextState = redoStack.value[redoStack.value.length - 1]
  redoStack.value = redoStack.value.slice(0, -1)
  c.loadFromJSON(JSON.parse(nextState)).then(() => {
    c.renderAll()
    isLoadingState.value = false
  })
}

// ---- Lifecycle ----
onMounted(() => {
  if (!canvasEl.value) return
  canvas = new Canvas(canvasEl.value, {
    selection: true,
    preserveObjectStacking: true,
  })
  const c = canvas
  c.setDimensions({ width: props.canvasWidth, height: props.canvasHeight })
  history.value = [JSON.stringify(c.toJSON())]

  c.on('object:added', () => { if (!isLoadingState.value) saveState() })
  c.on('object:modified', () => { if (!isLoadingState.value) saveState() })
  c.on('object:removed', () => { if (!isLoadingState.value) saveState() })

  // Load initial image if provided
  if (props.initialImage) {
    FabricImage.fromURL(props.initialImage).then((img) => {
      const cw = c.getWidth(); const ch = c.getHeight()
      const scale = Math.min(cw / (img.width || 1), ch / (img.height || 1))
      img.set({
        originX: 'left', originY: 'top',
        scaleX: scale, scaleY: scale,
        left: (cw - (img.width || 0) * scale) / 2,
        top: (ch - (img.height || 0) * scale) / 2,
        hasControls: true, selectable: true, evented: true, hasBorders: true,
      })
      img.setCoords()
      c.add(img)
      c.setActiveObject(img)
      c.renderAll()
      saveState()
    })
  }

  emit('canvasReady', c)

  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  canvas?.dispose()
  canvas = null
})

// ---- Image loading ----
function loadImage(file: File) {
  const c = getCanvas()
  const reader = new FileReader()
  reader.onload = () => {
    FabricImage.fromURL(reader.result as string).then((img) => {
      const cw = c.getWidth(); const ch = c.getHeight()
      const scale = Math.min(cw / (img.width || 1), ch / (img.height || 1))
      const sw = (img.width || 0) * scale
      const sh = (img.height || 0) * scale
      img.set({
        originX: 'left', originY: 'top',
        scaleX: scale, scaleY: scale,
        left: (cw - sw) / 2, top: (ch - sh) / 2,
        hasControls: true, selectable: true, evented: true, hasBorders: true,
      })
      img.setCoords()
      c.add(img)
      c.setActiveObject(img)
      c.renderAll()
      saveState()
    })
  }
  reader.readAsDataURL(file)
  emit('imageLoaded', file)
}

function onFilesDrop(files: File[]) {
  files.forEach(f => loadImage(f))
}

// ---- Drawing tools ----
function addHighlightRed() {
  const c = getCanvas()
  const r = new Rect({
    left: 100, top: 100, width: 120, height: 60,
    fill: 'transparent', stroke: '#EF4444', strokeWidth: strokeSize.value,
    cornerColor: '#EF4444', cornerSize: 8, transparentCorners: false,
    cornerStrokeColor: '#EF4444', borderColor: '#EF4444',
  })
  c.add(r)
  c.setActiveObject(r)
}

function addHighlightYellow() {
  const c = getCanvas()
  const r = new Rect({
    left: 100, top: 100, width: 120, height: 60,
    fill: 'transparent', stroke: '#FACC15', strokeWidth: strokeSize.value,
    cornerColor: '#FACC15', cornerSize: 8, transparentCorners: false,
    cornerStrokeColor: '#FACC15', borderColor: '#FACC15',
  })
  c.add(r)
  c.setActiveObject(r)
}

function addCircle() {
  const c = getCanvas()
  const circle = new Circle({
    left: 150, top: 150, radius: 40,
    fill: 'transparent', stroke: '#EF4444', strokeWidth: strokeSize.value,
  })
  c.add(circle)
  c.setActiveObject(circle)
}

function removeSelected() {
  const c = getCanvas()
  const active = c.getActiveObject()
  if (active) { c.remove(active); saveState() }
}
function bringToFront() {
  const c = getCanvas(); const o = c.getActiveObject()
  if (o) { c.bringObjectToFront(o); c.renderAll(); saveState() }
}
function bringForward() {
  const c = getCanvas(); const o = c.getActiveObject()
  if (o) { c.bringObjectForward(o); c.renderAll(); saveState() }
}
function sendBackward() {
  const c = getCanvas(); const o = c.getActiveObject()
  if (o) { c.sendObjectBackwards(o); c.renderAll(); saveState() }
}
function sendToBack() {
  const c = getCanvas(); const o = c.getActiveObject()
  if (o) { c.sendObjectToBack(o); c.renderAll(); saveState() }
}

// ---- Crop ----
function startCrop() {
  const c = getCanvas()
  if (cropRect.value) return
  const cw = c.getWidth(); const ch = c.getHeight()
  const rect = new Rect({
    left: (cw - 300) / 2, top: (ch - 200) / 2,
    width: 300, height: 200,
    fill: 'rgba(0,0,0,0.5)', stroke: '#FFFFFF', strokeWidth: 3,
    strokeDashArray: [10, 5], hasRotatingPoint: false,
    cornerColor: '#FFFFFF', cornerSize: 12, transparentCorners: false,
    cornerStrokeColor: '#000000', borderColor: '#FFFFFF',
  })
  c.add(rect); c.bringObjectToFront(rect); c.setActiveObject(rect); c.renderAll()
  cropRect.value = rect
}

function applyCrop() {
  const c = getCanvas()
  const cr = cropRect.value
  if (!cr) return
  const r = cr.getBoundingRect()
  const allObjects = c.getObjects()
  const toRemove: typeof allObjects = []
  for (const o of allObjects) {
    if (o === cr) continue
    const b = o.getBoundingRect()
    if (!(b.left + b.width < r.left || b.left > r.left + r.width ||
          b.top + b.height < r.top || b.top > r.top + r.height)) {
      toRemove.push(o)
    }
  }
  c.remove(cr)
  cropRect.value = null
  toRemove.forEach(o => c.remove(o))
  c.renderAll()
  const dataUrl = c.toDataURL({
    left: r.left, top: r.top, width: r.width, height: r.height,
    multiplier: 1, format: 'png',
  })
  FabricImage.fromURL(dataUrl).then((img) => {
    const cw = c.getWidth(); const ch = c.getHeight()
    const sc = Math.min(cw / (img.width || 1), ch / (img.height || 1), 1)
    img.set({
      originX: 'left', originY: 'top',
      scaleX: sc, scaleY: sc,
      left: (cw - (img.width || 0) * sc) / 2,
      top: (ch - (img.height || 0) * sc) / 2,
      hasControls: true, selectable: true, evented: true, hasBorders: true,
    })
    img.setCoords(); c.add(img); c.setActiveObject(img); c.renderAll(); saveState()
  })
}

// ---- Export & Preview ----
async function exportCanvas(): Promise<Blob | null> {
  const c = getCanvas()
  const blob = await c.toBlob({ format: 'png', multiplier: 1, enableRetinaScaling: true })
  if (blob) emit('exported', blob)
  return blob
}

async function generatePreview(previewEl?: HTMLElement | null): Promise<File | null> {
  const el = previewEl || previewContainerEl.value
  if (!el) return null
  try {
    await new Promise(r => setTimeout(r, 300))
    const imgs = el.querySelectorAll('img')
    const orig = new Map<HTMLImageElement, string>()
    for (const img of Array.from(imgs)) {
      if (img.src.startsWith('blob:')) {
        orig.set(img, img.src)
        try {
          const resp = await fetch(img.src)
          const blob = await resp.blob()
          const du = await new Promise<string>(resolve => {
            const fr = new FileReader()
            fr.onloadend = () => resolve(fr.result as string)
            fr.readAsDataURL(blob)
          })
          img.src = du
        } catch (e) { console.warn(e) }
      }
    }
    await new Promise(r => setTimeout(r, 100))
    const { toBlob } = await import('html-to-image')
    const blob = await toBlob(el, {
      quality: 1.0, pixelRatio: 3, cacheBust: true,
      skipAutoScale: false, backgroundColor: '#ffffff',
    })
    for (const [img, src] of orig.entries()) { img.src = src }
    if (!blob) throw new Error('Failed to generate preview')
    return new File([blob], `preview-${Date.now()}.png`, { type: 'image/png' })
  } catch (e) {
    console.error(e)
    alert('Gagal membuat thumbnail preview. Silakan coba lagi.')
    return null
  }
}

// ---- Keyboard shortcuts ----
function handleKeydown(e: KeyboardEvent) {
  if (!canvas) return
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return }
  if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
    e.preventDefault(); redo(); return
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
    e.preventDefault(); removeSelected(); return
  }
}

// ---- Exposed methods for parent ----
defineExpose({
  canvas,
  getCanvas,
  loadImage,
  exportCanvas,
  generatePreview,
  undo,
  redo,
  saveState,
  addHighlightRed,
  addHighlightYellow,
  addCircle,
  removeSelected,
  bringToFront,
  bringForward,
  sendBackward,
  sendToBack,
  startCrop,
  applyCrop,
  onFilesDrop,
  history,
  redoStack,
  strokeSize,
  previewContainerEl,
})
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div v-if="showToolbar" class="flex gap-2 pb-4 flex-wrap">
      <div class="flex items-center gap-2">
        <Label for="strokeSize">Stroke:</Label>
        <Input id="strokeSize" type="number" min="1" max="20" v-model.number="strokeSize" class="w-20" />
      </div>
      <Button variant="outline" @click="addHighlightRed" class="justify-start">
        <span class="inline-block w-3 h-3 rounded-sm mr-2 bg-red-500"></span>Highlight Red
      </Button>
      <Button variant="outline" @click="addHighlightYellow" class="justify-start">
        <span class="inline-block w-3 h-3 rounded-sm mr-2 bg-yellow-500"></span>Highlight Yellow
      </Button>
      <Button variant="outline" @click="addCircle" class="justify-start">🔴 Circle</Button>
      <Button variant="outline" @click="removeSelected" class="justify-start">🗑️ Remove</Button>
      <Button variant="outline" @click="bringToFront" class="justify-start">⏫ To Front</Button>
      <Button variant="outline" @click="bringForward" class="justify-start">🔼 Forward</Button>
      <Button variant="outline" @click="sendBackward" class="justify-start">🔽 Backward</Button>
      <Button variant="outline" @click="sendToBack" class="justify-start">⏬ To Back</Button>
      <Button variant="outline" @click="startCrop" class="justify-start">✂️ Crop</Button>
      <Button variant="outline" @click="applyCrop" class="justify-start">✅ Apply Crop</Button>
    </div>

    <!-- Canvas area -->
    <div class="overflow-x-auto overflow-y-hidden bg-muted/30 p-4 rounded-lg touch-pan-x">
      <div class="mx-auto bg-white" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
        <canvas ref="canvasEl" class="border border-border rounded-lg shadow-sm"
          :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
      </div>
    </div>

    <!-- Undo/Redo buttons -->
    <div class="flex flex-col sm:flex-row gap-2 mt-4">
      <Button variant="outline" @click="undo" class="flex-1" :disabled="history.length <= 1">↩️ Undo</Button>
      <Button variant="outline" @click="redo" class="flex-1" :disabled="redoStack.length === 0">↪️ Redo</Button>
      <Button @click="exportCanvas" class="flex-1">💾 Lihat Hasil</Button>
    </div>

    <!-- Hidden preview container for generating thumbnails -->
    <div ref="previewContainerEl" class="hidden"></div>
  </div>
</template>

<style scoped>
canvas { touch-action: none; }
</style>
