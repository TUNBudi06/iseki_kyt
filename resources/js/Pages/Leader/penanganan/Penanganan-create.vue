<script setup lang="ts">
import { ref } from 'vue'
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
import { penangananstore } from '$routes/leader'
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

const props = defineProps<{ kyt: KytData | null }>()

const editor = ref<InstanceType<typeof CanvasEditor> | null>(null)
const penangananUrlImage = ref('')

const form = useForm({
  title: '',
  kyt_list_id: 0,
  foto_path: null as File | null,
  result_path: null as File | null,
})

async function handleExport() {
  const blob = await editor.value?.exportCanvas()
  if (blob) {
    penangananUrlImage.value = URL.createObjectURL(blob)
    form.foto_path = new File([blob], `penanganan-${Date.now()}.png`, { type: 'image/png' })
  }
}

async function submitForm(e: Event) {
  e.preventDefault()
  const previewFile = await editor.value?.generatePreview()
  if (!previewFile) return
  form.result_path = previewFile
  form.submit(route(penangananstore()).url, {
    preserveScroll: true,
    onSuccess: () => toast.success('Penanganan berhasil ditambahkan!'),
    onError: (err) => {
      const msg = Object.values(err).flat().join(', ')
      toast.error(msg || 'Gagal menambahkan penanganan')
    },
  })
}
</script>

<template>
  <Head><title>Tambah Penanganan - Leader Dashboard</title></Head>

  <LeaderLayout>
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-3xl tracking-tight">Tambah Penanganan</h3>
        <span class="text-muted-foreground mt-1">Tambahkan penanganan untuk kiken yochi training</span>
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
          <CardTitle class="w-full text-center font-bold text-3xl">Form Penanganan</CardTitle>
          <CardDescription class="w-full text-center">Isi form penanganan pada KYT</CardDescription>
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
              <Label for="foto_path">Upload Gambar:</Label>
              <DropZone @drop="(e: { acceptedFiles: File[] }) => editor?.onFilesDrop(e.acceptedFiles)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Canvas Editor -->
      <Card>
        <CardContent class="p-4">
          <CanvasEditor ref="editor" :canvas-width="1200" :canvas-height="600" />
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
          <div class="overflow-x-auto">
            <div ref="editor.previewContainerEl" class="relative mx-auto" :style="{ width: '1200px', height: '600px', background: '#FFC0CB', border: '4px solid black', padding: '8px' }">
              <template v-if="penangananUrlImage">
                <div class="absolute top-0 left-0 w-full flex items-center justify-center pt-2" style="max-width: 1200px;">
                  <span class="font-bold text-2xl leading-tight text-center text-black uppercase">{{ form.title }}</span>
                </div>
                <div class="absolute inset-0 left-0 top-16" :style="{ width: '1200px', height: '600px' }">
                  <img :src="penangananUrlImage" alt="Hasil editing" class="rounded shadow-lg w-full h-full" />
                </div>
              </template>
              <template v-else>
                <span class="font-bold text-2xl leading-tight text-center text-black uppercase">{{ form.title || 'Masukkan judul untuk preview' }}</span>
              </template>
            </div>
          </div>
          <div class="mt-4">
            <Button @click="submitForm" class="w-full" :disabled="form.processing || !form.title">
              {{ form.processing ? 'Menyimpan...' : 'Simpan Penanganan' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </LeaderLayout>
</template>
