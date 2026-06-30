<script setup lang="ts">
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import KytPreview from '@/Components/KytPreview.vue'
import { assetUrl, routeUrl } from '@tunbudi06/inertia-route-helper'
import { kytdelete } from '$routes/leader'
import { downloadKytPptx, downloadKytImage } from '$lib/download/index.ts'
import type { KytData as PptxKytData } from '$lib/download/KytPptx.ts'
import { router } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import { ref, onMounted } from 'vue'

interface KytItem {
  id?: number | string
  title?: string
  user_name?: string
  result_path?: string
  foto_path?: string
  potensi?: string
  penanganan?: string
  created_at?: string
  penanganans?: { result_path?: string; title?: string } | null
  [key: string]: unknown
}

interface TeamItem {
  team_name?: string
  [key: string]: unknown
}

const props = defineProps<{
  isOpen: boolean
  selectedKyt: KytItem | null
  team: TeamItem | null
  bgKyt: string
}>()

const emit = defineEmits(['update:isOpen'])

const dateparams = ref(0)
onMounted(() => { dateparams.value = Date.now() })

function deleteKyt(kytId: number | string) {
  if (confirm('Are you sure you want to delete this KYT? This action cannot be undone.')) {
    router.delete(routeUrl(kytdelete({ id: kytId })), {
      onSuccess: () => {
        toast.success('KYT deleted successfully!')
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors).flat().join(', ')
        toast.error(errorMsg || 'Failed to delete KYT')
      },
    })
  }
}

async function downloadAsPPT(kytData: KytItem) {
  if (!kytData) return
  const pptx = await downloadKytPptx(kytData as unknown as PptxKytData, props.team)
  try {
    await pptx.writeFile({ fileName: `KYT_${(kytData.title || 'kyt').replace(/\s+/g, '-')}.pptx` })
    toast.success('PowerPoint downloaded successfully!')
  } catch (error) {
    toast.error('Failed to download PowerPoint')
    console.error('PPT Download error:', error)
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="md:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-scroll overflow-x-hidden">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold text-pink-600">
          KYT Details - {{ selectedKyt?.title || '' }}
        </DialogTitle>
        <DialogDescription>
          Submitted by {{ selectedKyt?.user_name || '' }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="selectedKyt" class="space-y-6 py-4">
        <!-- KYT Preview -->
        <KytPreview
          :scale-to-fit="true"
          :bg-kyt="bgKyt"
          :kyt-date="selectedKyt.created_at || ''"
          :kyt-team="team?.team_name || ''"
          :kyt-title="selectedKyt.title || ''"
          :saved-image-url="selectedKyt.foto_path ? assetUrl(selectedKyt.foto_path, { query: { t: dateparams } }) : (selectedKyt.result_path ? assetUrl(selectedKyt.result_path, { query: { t: dateparams } }) : '')"
          :kyt-pic="selectedKyt.user_name || ''"
          :kyt-potensi="selectedKyt.potensi || ''"
          :kyt-penanganan="selectedKyt.penanganan || ''"
        />

        <!-- KYT Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2 md:col-span-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Title</div>
            <div class="text-lg font-bold text-gray-900">{{ selectedKyt.title }}</div>
          </div>

          <div class="space-y-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Submitted By</div>
            <div class="text-base font-medium text-gray-900">{{ selectedKyt.user_name }}</div>
          </div>

          <div class="space-y-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Status</div>
            <Badge variant="default" class="bg-green-500 text-white">Submitted</Badge>
          </div>

          <div class="space-y-2 md:col-span-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Potensi Bahaya</div>
            <div class="text-base text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
              {{ selectedKyt.potensi }}
            </div>
          </div>

          <div class="space-y-2 md:col-span-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Penanganan</div>
            <div class="text-base text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
              {{ selectedKyt.penanganan }}
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Submitted Date</div>
            <div class="text-base text-gray-700">
              {{ new Date(selectedKyt.created_at).toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              }) }}
            </div>
          </div>

          <div v-if="team" class="space-y-2">
            <div class="text-sm font-semibold text-gray-500 uppercase">Team</div>
            <div class="text-base font-medium text-pink-600">{{ team.team_name }}</div>
          </div>
        </div>

        <!-- Original Photo -->
        <div v-if="selectedKyt.foto_path" class="space-y-3">
          <div class="text-sm font-semibold text-gray-500 uppercase">Original Photo</div>
          <div class="rounded-lg overflow-hidden shadow-md bg-gray-100">
            <img
              :src="assetUrl(selectedKyt.foto_path, { query: { t: dateparams } })"
              alt="Original KYT"
              class="w-full h-auto object-fit"
            />
          </div>
        </div>

        <!-- Penanganan Section -->
        <template v-if="selectedKyt.penanganans">
          <div class="space-y-3">
            <div class="text-sm font-semibold text-gray-500 uppercase">Penanganan</div>
            <div class="text-sm font-bold">Hasil Penanganan yang dilakukan:</div>
            <div class="rounded-lg overflow-hidden shadow-md bg-gray-100">
              <img
                :src="assetUrl(selectedKyt.penanganans.result_path, { query: { t: dateparams } })"
                alt="Penanganan KYT"
                class="w-full h-auto"
              />
            </div>
          </div>
        </template>
        <div v-else class="space-y-2">
          <div class="text-lg font-semibold text-gray-500 uppercase">Belum ada penanganan</div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center gap-3 pt-4 border-t">
          <div class="flex gap-2">
            <Button variant="outline" class="flex items-center gap-2 bg-blue-50 hover:bg-blue-100" @click="downloadKytImage(selectedKyt, dateparams)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Download Image
            </Button>
            <Button variant="outline" class="flex items-center gap-2 bg-orange-50 hover:bg-orange-100" @click="downloadAsPPT(selectedKyt)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Download PPT
            </Button>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="$emit('update:isOpen', false)">Close</Button>
            <Button variant="destructive" class="flex items-center gap-2" @click="deleteKyt(selectedKyt.id); $emit('update:isOpen', false)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Delete KYT
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
