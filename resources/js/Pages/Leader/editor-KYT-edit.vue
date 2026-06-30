<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import LeaderLayout from '@/Layouts/LeaderLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, Head } from '@inertiajs/vue3'
import KytPreview from '@/Components/KytPreview.vue'
import DropZone from '@/Components/DropZone.vue'
import CanvasEditor from '@/Components/CanvasEditor.vue'
import { kytupdate } from '$routes/leader'
import { routeUrl } from '@tunbudi06/inertia-route-helper'
import { toast } from 'vue-sonner'
import { maxChartTitleLength } from './KytParameter.ts'

interface KytDataItem {
  id?: number | string
  title?: string
  user_name?: string
  potensi?: string
  penanganan?: string
  result_path?: string
  foto_path?: string
  [key: string]: unknown
}

const props = defineProps<{
  bgKyt: string
  kytDate: string | Date
  kytTeam: string
  kytData: KytDataItem | null
}>()

const editor = ref<InstanceType<typeof CanvasEditor> | null>(null)
const previewContainerEl = ref<HTMLElement | null>(null)
const savedImageUrl = ref('')
const exporting = ref(false)
const kytTitle = ref(props.kytData?.title || '')
const kytPic = ref(props.kytData?.user_name || '')
const kytPotensi = ref(props.kytData?.potensi || '')
const kytPenanganan = ref(props.kytData?.penanganan || '')

const form = useForm({
  foto_path: null as File | null,
  result_path: null as File | null,
  penanganan: '',
  potensi: '',
  user_name: '',
  title: '',
})

function syncForm() {
  form.title = kytTitle.value
  form.user_name = kytPic.value
  form.potensi = kytPotensi.value
  form.penanganan = kytPenanganan.value
}

function onCanvasExported(blob: Blob) {
  if (savedImageUrl.value) URL.revokeObjectURL(savedImageUrl.value)
  savedImageUrl.value = URL.createObjectURL(blob)
  form.foto_path = new File([blob], `kyt-${Date.now()}.png`, { type: 'image/png' })
  toast.success('Hasil editing berhasil di-load ke preview')
}

async function handleExport() {
  if (!kytTitle.value) {
    toast.error('Isi judul KYT terlebih dahulu')
    return
  }
  exporting.value = true
  try {
    const blob = await editor.value?.exportCanvas()
    if (blob) {
      if (savedImageUrl.value) URL.revokeObjectURL(savedImageUrl.value)
      savedImageUrl.value = URL.createObjectURL(blob)
      form.foto_path = new File([blob], `kyt-${Date.now()}.png`, { type: 'image/png' })
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

async function submitKyt() {
  syncForm()
  if (!kytTitle.value) {
    toast.error('Judul KYT wajib diisi')
    return
  }
  
  if (!form.foto_path) {
    await handleExport()
    if (!form.foto_path) return
  }
  
  exporting.value = true
  try {
    const innerEl = previewContainerEl.value?.parentElement
    const origTransform = innerEl?.style.transform || ''
    if (innerEl) innerEl.style.transform = ''
    const previewFile = await editor.value?.generatePreview(previewContainerEl.value)
    if (innerEl) innerEl.style.transform = origTransform
    if (!previewFile) {
      exporting.value = false
      return
    }
    form.result_path = previewFile
    form.post(routeUrl(kytupdate({ id: props.kytData?.id })), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('KYT berhasil diperbarui!')
        exporting.value = false
      },
      onError: (errors) => {
        const msg = Object.values(errors).flat().join(', ')
        toast.error(msg || 'Gagal memperbarui KYT')
        exporting.value = false
      },
    })
  } catch (e) {
    toast.error('Gagal memperbarui KYT')
    exporting.value = false
  }
}
</script>

<template>
  <Head><title>Edit KYT - Leader Dashboard</title></Head>

  <LeaderLayout>
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-3xl tracking-tight">Edit KYT</h3>
        <span class="text-muted-foreground mt-1">Edit kiken yochi training</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data KYT</CardTitle>
          <CardDescription>Edit data KYT</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="kytTitle">Judul <span class="text-xs text-muted-foreground">({{ kytTitle.length }}/{{ maxChartTitleLength }})</span></Label>
            <Input id="kytTitle" v-model="kytTitle" :maxlength="maxChartTitleLength" placeholder="Masukkan judul KYT" />
          </div>
          <div class="grid gap-2">
            <Label for="kytPic">PIC</Label>
            <Input id="kytPic" v-model="kytPic" maxlength="50" placeholder="Nama penyampai" />
          </div>
          <div class="grid gap-2">
            <Label for="kytPotensi">Potensi Bahaya <span class="text-xs text-muted-foreground">({{ kytPotensi.length }}/500)</span></Label>
            <textarea id="kytPotensi" v-model="kytPotensi" maxlength="500"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Deskripsikan potensi bahaya"></textarea>
          </div>
          <div class="grid gap-2">
            <Label for="kytPenanganan">Penanganan <span class="text-xs text-muted-foreground">({{ kytPenanganan.length }}/500)</span></Label>
            <textarea id="kytPenanganan" v-model="kytPenanganan" maxlength="500"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Deskripsikan penanganan"></textarea>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload / Ganti Gambar</CardTitle>
          <CardDescription>Upload gambar baru untuk diedit</CardDescription>
        </CardHeader>
        <CardContent>
          <DropZone @drop="(e: { acceptedFiles: File[] }) => editor?.onFilesDrop(e.acceptedFiles)" />
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <CanvasEditor ref="editor" :canvas-width="680" :canvas-height="500" @exported="onCanvasExported" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kiken Yochi Training - Preview</CardTitle>
          <CardDescription>
            <template v-if="savedImageUrl">Hasil editing dari canvas (simpan untuk finalisasi)</template>
            <template v-else>Klik "💾 Lihat Hasil" untuk melihat hasil editing dari canvas</template>
          </CardDescription>
        </CardHeader>
        <CardContent class="p-4 space-y-4">
          <div class="overflow-x-auto">
            <KytPreview
              v-model:element-id="previewContainerEl"
              :scale-to-fit="true"
              :bg-kyt="bgKyt"
              :kyt-date="kytDate"
              :kyt-team="kytTeam"
              :kyt-title="kytTitle"
              :saved-image-url="savedImageUrl"
              :kyt-pic="kytPic"
              :kyt-potensi="kytPotensi"
              :kyt-penanganan="kytPenanganan"
            />
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <Button @click="handleExport" variant="outline" class="flex-1" :disabled="exporting">
              <template v-if="exporting">⏳ Mengekspor...</template>
              <template v-else>💾 Refresh Hasil</template>
            </Button>
            <Button @click="submitKyt" class="flex-1" :disabled="exporting || !kytTitle">
              <template v-if="exporting">⏳ Menyimpan...</template>
              <template v-else>{{ form.processing ? 'Menyimpan...' : 'Update KYT' }}</template>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </LeaderLayout>
</template>
