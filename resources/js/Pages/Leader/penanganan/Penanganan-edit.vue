<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import LeaderLayout from '@/Layouts/LeaderLayout.vue'
import { useForm, Head } from '@inertiajs/vue3'
import DropZone from '@/Components/DropZone.vue'
import CanvasEditor from '@/Components/CanvasEditor.vue'
import { assetUrl, route } from '@tunbudi06/inertia-route-helper'
import { maxChartTitleLength } from '$/Pages/Leader/KytParameter.ts'
import { penangananupdate } from '$routes/leader'
import { toast } from 'vue-sonner'

interface KytData {
  id?: number | string
  title?: string
  user_name?: string
  potensi?: string
  penanganan?: string
  result_path?: string
  foto_path?: string
  kyt_list_id?: number | string
  [key: string]: unknown
}

interface PenangananData {
  id?: number | string
  penanganan_title?: string
  foto_path?: string
  result_path?: string
  [key: string]: unknown
}

const props = defineProps<{
  kyt: KytData | null
  penanganan: PenangananData | null
}>()

const editor = ref<InstanceType<typeof CanvasEditor> | null>(null)
const previewContainerEl = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const penangananUrlImage = ref('')
const exporting = ref(false)
const previewScale = ref(1)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width
    if (w) previewScale.value = Math.min(w / 1208, 1)
  })
  if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const form = useForm({
  title: props.penanganan?.penanganan_title || '',
  foto_path: null as File | null,
  result_path: null as File | null,
})

function onCanvasExported(blob: Blob) {
  if (penangananUrlImage.value) URL.revokeObjectURL(penangananUrlImage.value)
  penangananUrlImage.value = URL.createObjectURL(blob)
  form.foto_path = new File([blob], `penanganan-${Date.now()}.png`, { type: 'image/png' })
  toast.success('Hasil editing berhasil di-load ke preview')
}

async function handleExport() {
  if (!form.title) {
    toast.error('Isi judul penanganan terlebih dahulu')
    return
  }
  exporting.value = true
  try {
    const blob = await editor.value?.exportCanvas()
    if (blob) {
      if (penangananUrlImage.value) URL.revokeObjectURL(penangananUrlImage.value)
      penangananUrlImage.value = URL.createObjectURL(blob)
      form.foto_path = new File([blob], `penanganan-${Date.now()}.png`, { type: 'image/png' })
      toast.success('Hasil editing berhasil di-load ke preview')
    } else {
      toast.error('Gagal mengekspor canvas. Upload gambar terlebih dahulu.')
    }
  } catch (e) {
    toast.error('Gagal mengekspor gambar')
    console.error(e)
  } finally {
    exporting.value = false
  }
}

async function submitForm(e: Event) {
  e.preventDefault()
  if (!form.title) {
    toast.error('Judul penanganan wajib diisi')
    return
  }
  
  if (!form.foto_path) {
    await handleExport()
    if (!form.foto_path) return
  }
  
  exporting.value = true
  try {
    const el = previewContainerEl.value
    const origTransform = el?.style.transform || ''
    if (el) el.style.transform = ''
    const previewFile = await editor.value?.generatePreview(previewContainerEl.value)
    if (el) el.style.transform = origTransform
    if (!previewFile) {
      exporting.value = false
      return
    }
    form.result_path = previewFile
    form.post(route(penangananupdate({ id: props.penanganan?.id })).url, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Penanganan berhasil diperbarui!')
        exporting.value = false
      },
      onError: (err) => {
        const msg = Object.values(err).flat().join(', ')
        toast.error(msg || 'Gagal memperbarui penanganan')
        exporting.value = false
      },
    })
  } catch (e) {
    toast.error('Gagal memperbarui penanganan')
    exporting.value = false
  }
}
</script>

<template>
  <Head><title>Edit Penanganan - Leader Dashboard</title></Head>

  <LeaderLayout>
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-3xl tracking-tight">Edit Penanganan</h3>
        <span class="text-muted-foreground mt-1">Edit penanganan untuk kiken yochi training</span>
      </div>

      <!-- KYT Preview -->
      <Card>
        <CardHeader class="space-y-0">
          <CardTitle class="w-full text-center font-bold text-3xl">KYT Preview</CardTitle>
          <CardDescription class="w-full text-center">Berikut adalah preview KYT yang telah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <div class="relative mx-auto" :style="{ width: '1280px', height: '680px' }">
              <img :src="assetUrl(props.kyt?.result_path)" alt="KYT Background" class="rounded-lg border border-border object-contain w-full h-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Form -->
      <Card>
        <CardHeader class="space-y-0">
          <CardTitle class="w-full text-center font-bold text-3xl">Form Edit Penanganan</CardTitle>
          <CardDescription class="w-full text-center">Edit form penanganan pada KYT</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="title">Judul Penanganan:
                <span class="text-xs text-muted-foreground ml-2">({{ form.title.length }}/{{ maxChartTitleLength }})</span>
              </Label>
              <Input id="title" v-model="form.title" :maxlength="maxChartTitleLength" placeholder="Masukkan judul penanganan" />
            </div>
            <div class="grid gap-2">
              <Label for="foto_path">Upload Gambar (kosongkan jika tidak ingin mengganti):</Label>
              <DropZone @drop="(e: { acceptedFiles: File[] }) => editor?.onFilesDrop(e.acceptedFiles)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Canvas Editor -->
      <Card>
        <CardContent class="p-4">
          <CanvasEditor ref="editor" :canvas-width="1200" :canvas-height="600" @exported="onCanvasExported" />
        </CardContent>
      </Card>

      <!-- Preview -->
      <Card>
        <CardHeader>
          <CardTitle>Penanganan - Preview</CardTitle>
          <CardDescription>
            <template v-if="penangananUrlImage">Hasil gambar yang telah disimpan</template>
            <template v-else>Klik "💾 Lihat Hasil" untuk melihat hasil</template>
          </CardDescription>
        </CardHeader>
        <CardContent class="p-4">
          <div ref="wrapperRef" class="w-full overflow-hidden" :style="{ height: (608 * previewScale) + 'px' }">
            <div ref="previewContainerEl" class="flex flex-col origin-top-left" :class="penangananUrlImage ? '' : 'justify-center'" :style="{ width: '1200px', height: '600px', background: '#FFC0CB', border: '4px solid black', transform: 'scale(' + previewScale + ')' }">
              <div class="flex items-center justify-center py-2 flex-shrink-0" :class="penangananUrlImage ? '' : 'h-full'" :style="penangananUrlImage ? { height: '50px' } : {}">
                <span class="font-bold text-2xl leading-tight text-center text-black uppercase">{{ form.title || 'Masukkan judul untuk preview' }}</span>
              </div>
              <template v-if="penangananUrlImage">
                <div class="flex-1 min-h-0">
                  <img :src="penangananUrlImage" alt="Hasil editing" class="w-full h-full" />
                </div>
              </template>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 mt-4">
            <Button @click="handleExport" variant="outline" class="flex-1" :disabled="exporting">
              <template v-if="exporting">⏳ Mengekspor...</template>
              <template v-else>💾 Lihat Hasil</template>
            </Button>
            <Button @click="submitForm" class="flex-1" :disabled="exporting || !form.title">
              <template v-if="exporting">⏳ Menyimpan...</template>
              <template v-else>{{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}</template>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </LeaderLayout>
</template>
