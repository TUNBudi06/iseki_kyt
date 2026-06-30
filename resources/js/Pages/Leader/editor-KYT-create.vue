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
import { kytstore } from '$routes/leader'
import { routeUrl } from '@tunbudi06/inertia-route-helper'
import { toast } from 'vue-sonner'
import { maxChartTitleLength } from './KytParameter.ts'

const props = defineProps<{
  bgKyt: string
  kytDate: string | Date
  kytTeam: string
  kytTeamId: string | number
  kytDateId: string | number
}>()

const editor = ref<InstanceType<typeof CanvasEditor> | null>(null)
const savedImageUrl = ref('')
const kytTitle = ref('')
const kytPic = ref('')
const kytPotensi = ref('')
const kytPenanganan = ref('')

const form = useForm({
  foto_path: null as File | null,
  result_path: null as File | null,
  penanganan: '',
  potensi: '',
  user_name: '',
  title: '',
  team_id: 0,
  kyt_date_id: 0,
})

function syncForm() {
  form.kyt_date_id = props.kytDateId as number
  form.team_id = props.kytTeamId as number
  form.title = kytTitle.value
  form.user_name = kytPic.value
  form.potensi = kytPotensi.value
  form.penanganan = kytPenanganan.value
}

async function handleExport() {
  const blob = await editor.value?.exportCanvas()
  if (blob) {
    savedImageUrl.value = URL.createObjectURL(blob)
    form.foto_path = new File([blob], `kyt-${Date.now()}.png`, { type: 'image/png' })
  }
}

async function submitKyt() {
  syncForm()
  const previewFile = await editor.value?.generatePreview()
  if (!previewFile) return
  form.result_path = previewFile
  form.post(routeUrl(kytstore()), {
    preserveScroll: true,
    onSuccess: () => toast.success('KYT berhasil disimpan!'),
    onError: (errors) => {
      const msg = Object.values(errors).flat().join(', ')
      toast.error(msg || 'Gagal menyimpan KYT')
    },
  })
}
</script>

<template>
  <Head><title>Create KYT - Leader Dashboard</title></Head>

  <LeaderLayout>
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-3xl tracking-tight">Buat KYT Baru</h3>
        <span class="text-muted-foreground mt-1">Buat kiken yochi training baru</span>
      </div>

      <!-- Form Data -->
      <Card>
        <CardHeader>
          <CardTitle>Data KYT</CardTitle>
          <CardDescription>Isi data KYT</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="kytTitle">Judul <span class="text-xs text-muted-foreground">({{ kytTitle.length }}/{{ maxChartTitleLength }})</span></Label>
            <Input id="kytTitle" v-model="kytTitle" :maxlength="maxChartTitleLength" placeholder="Masukkan judul KYT" />
          </div>
          <div class="grid gap-2">
            <Label for="kytPic">PIC <span class="text-xs text-muted-foreground">({{ kytPic.length }}/50)</span></Label>
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

      <!-- Image Upload -->
      <Card>
        <CardHeader>
          <CardTitle>Upload Gambar</CardTitle>
          <CardDescription>Upload gambar yang akan diedit</CardDescription>
        </CardHeader>
        <CardContent>
          <DropZone @drop="(e: { acceptedFiles: File[] }) => editor?.onFilesDrop(e.acceptedFiles)" />
        </CardContent>
      </Card>

      <!-- Canvas Editor -->
      <Card>
        <CardContent class="p-4">
          <CanvasEditor ref="editor" :canvas-width="680" :canvas-height="500" />
        </CardContent>
      </Card>

      <!-- Preview -->
      <Card>
        <CardHeader>
          <CardTitle>Kiken Yochi Training - Preview</CardTitle>
          <CardDescription>
            <template v-if="savedImageUrl">Hasil gambar yang telah disimpan</template>
            <template v-else>Klik "💾 Lihat Hasil" untuk melihat hasil</template>
          </CardDescription>
        </CardHeader>
        <CardContent class="p-4">
          <div class="overflow-x-auto">
            <KytPreview
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
          <div class="flex flex-col sm:flex-row gap-2 mt-4">
            <Button @click="handleExport" variant="outline" class="flex-1">💾 Lihat Hasil</Button>
            <Button @click="submitKyt" class="flex-1" :disabled="form.processing || !kytTitle">
              {{ form.processing ? 'Menyimpan...' : 'Simpan KYT' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </LeaderLayout>
</template>
