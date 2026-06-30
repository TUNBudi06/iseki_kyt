<script setup lang="ts">
import AdminLayout from '@/Layouts/AdminLayout.vue'
import KytPreview from '@/Components/KytPreview.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList,
} from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '@/components/ui/tooltip'
import { router, Head } from '@inertiajs/vue3'
import { assetUrl, routeUrl } from '@tunbudi06/inertia-route-helper'
import { EmptySliceAdderKyt, initPptxKyt, PenangananSliceKyt, SliceAdderKyt } from '$lib/download/KytPptx.ts'
import { toast } from 'vue-sonner'
import { list as kytListRoute } from '$routes/admin/kyt'
import { ref, computed, watch, onMounted } from 'vue'

interface KytListRaw {
  id?: number | string
  kyt_date?: string
  number_of_Weeks?: number
  kyt_lists?: KytListItem[]
}

interface KytListItem {
  id?: number | string
  team_k_y_t_id?: number | string
  result_path?: string
  title?: string
  user_name?: string
  potensi?: string
  penanganan?: string
  penanganans?: {
    result_path?: string
    title?: string
    foto_path?: string
    penanganan_title?: string
  } | null
}

interface TeamInfo {
  id?: number | string
  team_name?: string
}

interface TableRow {
  no: number
  id?: number | string
  minggu_kyt: string
  kyt_date?: string
  kyt_lists: KytListItem[]
  [teamName: string]: unknown
}

interface SelectedKyt extends KytListItem {
  team_name: string
  kyt_date?: string
}

import type { KytData, Team } from '$lib/download/KytPptx.ts'

const props = defineProps<{
  kytLists: KytListRaw[]
  teamKyt: TeamInfo[]
  auth?: { user?: { username?: string; role?: string } } | null
  availableMonths: { value: string; label: string }[]
  selectedMonthYear: string
  bgKyt: string
}>()

const dateparams = ref(0)
onMounted(() => { dateparams.value = Date.now() })

const isDialogOpen = ref(false)
const selectedKyts = ref<SelectedKyt[]>([])
const monthFilter = ref('')

watch(() => props.selectedMonthYear, (val) => { monthFilter.value = val }, { immediate: true })

// Format data for table
const formattedData = computed<TableRow[]>(() => {
  return (props.kytLists || []).map((item: KytListRaw, index: number) => {
    const row: TableRow = {
      no: index + 1,
      id: item.id,
      minggu_kyt: new Date(item.kyt_date || '').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) + ' Week ' + item.number_of_Weeks,
      kyt_date: item.kyt_date,
      kyt_lists: item.kyt_lists || [],
    }
    for (const team of props.teamKyt || []) {
      const teamKyt = (item.kyt_lists || []).find((t: KytListItem) => t.team_k_y_t_id === team.id)
      row[team.team_name || ''] = teamKyt
        ? (teamKyt.penanganans ? '✓' : '-')
        : '✗'
    }
    return row
  })
})

// Search/filter
const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return formattedData.value
  const q = search.value.toLowerCase()
  return formattedData.value.filter((row: TableRow) =>
    String(row.no).includes(q) ||
    (row.minggu_kyt || '').toLowerCase().includes(q)
  )
})

// Pagination
const pageSize = 10
const currentPage = ref(1)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize)))

// Month filter
function changeMonth(direction: number) {
  const current = monthFilter.value || props.selectedMonthYear
  if (!current) return
  const [year, month] = current.split('-').map(Number)
  const d = new Date(year, month - 1 + direction, 1)
  monthFilter.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

watch(monthFilter, (val: string) => {
  if (val !== props.selectedMonthYear && val !== '') {
    router.get(routeUrl(kytListRoute({ query: { month_year: val } })), {}, {
      preserveState: true, preserveScroll: true,
    })
  }
})

function viewKytDetails(row: TableRow) {
  selectedKyts.value = (row.kyt_lists || []).map((kyt: KytListItem) => ({
    ...kyt,
    team_name: (props.teamKyt || []).find((t: TeamInfo) => t.id === kyt.team_k_y_t_id)?.team_name || 'Unknown Team',
    kyt_date: row.kyt_date,
  }))
  isDialogOpen.value = true
}

async function downloadAsPPT(row: TableRow) {
  const firstTitle = ((row.kyt_lists || []).find(k => k?.title)?.title || row.minggu_kyt).replace(/\s+/g, '_')
  const pptx = await initPptxKyt(props.auth?.user?.username || 'User', firstTitle)
  for (const team of props.teamKyt || []) {
    const kytData = (row.kyt_lists || []).find((kyt: KytListItem) => kyt.team_k_y_t_id === team.id)
    if (kytData) {
      SliceAdderKyt(pptx, kytData as unknown as KytData, team as unknown as Team)
      if (kytData.penanganans) {
        PenangananSliceKyt(pptx, kytData.penanganans.penanganan_title || '', kytData.penanganans.foto_path)
      } else {
        PenangananSliceKyt(pptx, 'Penanganan Belum submit')
      }
    } else {
      EmptySliceAdderKyt(pptx, team as unknown as Team)
      PenangananSliceKyt(pptx, 'KYT Tidak Diajukan')
    }
  }
  try {
    await pptx.writeFile({ fileName: `KYT_${firstTitle}.pptx` })
    toast.success('PowerPoint downloaded successfully!')
  } catch (error) {
    console.error('PPT Download error:', error)
  }
}

function getTooltipText(val: string) {
  if (val === '✓') return 'KYT submitted Dan Sudah ditangani'
  if (val === '-') return 'KYT submitted Dan Belum ditangani'
  return 'KYT BELUM DI SUBMIT'
}

function getTooltipClass(val: string) {
  if (val === '✓') return 'inline-block bg-green-100 rounded-full px-2 py-0.5'
  if (val === '-') return 'inline-block bg-yellow-100 rounded-full px-2 py-0.5'
  return 'inline-block bg-red-100 rounded-full px-2 py-0.5'
}
</script>

<template>
  <Head>
    <title>KYT Lists - Admin</title>
  </Head>

  <AdminLayout>
    <Card>
      <CardHeader class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
        <div class="flex justify-between w-full items-center">
          <div>
            <CardTitle class="text-2xl font-bold text-white">KYT Lists</CardTitle>
            <CardDescription class="text-pink-50">Manage and view all KYT.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-1">
            <Label>Filter by Month:</Label>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="icon" @click="changeMonth(-1)" title="Previous month">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </Button>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-40 justify-start text-left font-normal">
                    {{ monthFilter || 'Select month...' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search month..." />
                    <CommandEmpty>No months found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          v-for="item in availableMonths"
                          :key="item.value"
                          :value="item.value"
                          @select="monthFilter = item.value"
                        >
                          {{ item.label }}
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon" @click="changeMonth(1)" title="Next month">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </Button>
            </div>
          </div>
          <div class="flex-1">
            <Label>Search:</Label>
            <Input v-model="search" placeholder="Search..." />
          </div>
        </div>

        <TooltipProvider>
          <div class="overflow-x-auto">
          <Table>
            <TableCaption>A list of KYT submissions by week and team.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead class="w-12 px-2 py-2 text-xs">No</TableHead>
                <TableHead class="px-3 py-2 text-xs">Minggu KYT</TableHead>
                <TableHead v-for="team in teamKyt" :key="team.id" class="max-w-20 px-2 py-2 text-xs">
                  <p class="text-balance text-center leading-tight">{{ team.team_name }}</p>
                </TableHead>
                <TableHead class="text-end px-3 py-2 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in paginatedData" :key="row.no" class="hover:bg-muted/50">
                <TableCell class="font-medium px-2 py-2 text-xs">{{ row.no }}</TableCell>
                <TableCell class="px-3 py-2 text-xs" v-html="row.minggu_kyt"></TableCell>
                <TableCell v-for="team in teamKyt" :key="team.id" class="text-center px-2 py-2 text-xs">
                  <Tooltip>
                    <TooltipTrigger :class="getTooltipClass(row[team.team_name])">
                      {{ row[team.team_name] }}
                    </TooltipTrigger>
                    <TooltipContent>
                      {{ getTooltipText(row[team.team_name]) }}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell class="text-end flex gap-1 px-3 py-2">
                  <Button variant="outline" size="sm" @click="viewKytDetails(row)" :disabled="!row.kyt_lists || row.kyt_lists.length === 0" class="flex items-center gap-1 h-8 px-2 text-xs">View</Button>
                  <Button variant="outline" size="sm" @click="downloadAsPPT(row)" :disabled="!row.kyt_lists || row.kyt_lists.length === 0" class="flex items-center gap-1 h-8 px-2 text-xs bg-orange-50 hover:bg-orange-100">PPT</Button>
                </TableCell>
              </TableRow>
              <TableRow v-if="paginatedData.length === 0">
                <TableCell :colspan="2 + (teamKyt?.length || 0) + 1" class="text-center py-8 text-gray-500">No data available</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </div>
        </TooltipProvider>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>Showing {{ paginatedData.length }} of {{ filteredData.length }} entries</div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="currentPage--">Previous</Button>
            <span class="flex items-center px-3">{{ currentPage }} / {{ totalPages }}</span>
            <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="currentPage++">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- View KYT Details Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-none md:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle class="text-2xl font-bold text-pink-600">KYT Submissions</DialogTitle>
          <DialogDescription>View all team submissions for the selected week</DialogDescription>
        </DialogHeader>

        <div class="space-y-8 py-4 min-w-0">
          <div v-if="selectedKyts.length === 0" class="text-center py-8 text-muted-foreground">
            No KYT submissions for this week
          </div>
          <div v-for="kyt in selectedKyts" :key="kyt.id" class="border-2 border-pink-200 rounded-lg p-6 space-y-4">
            <div class="flex items-center justify-between border-b-2 border-pink-200 pb-3">
              <h3 class="text-xl font-bold text-pink-600 break-words">{{ kyt.team_name }}</h3>
              <span class="text-sm text-muted-foreground break-words">{{ kyt.user_name }}</span>
            </div>

            <div class="px-2 md:px-6">
              <KytPreview
                :scale-to-fit="true"
                :bg-kyt="bgKyt"
                :kyt-date="kyt.kyt_date || ''"
                :kyt-team="kyt.team_name"
                :kyt-title="kyt.title || ''"
                :saved-image-url="kyt.foto_path ? assetUrl(kyt.foto_path, { query: { t: dateparams } }) : (kyt.result_path ? assetUrl(kyt.result_path, { query: { t: dateparams } }) : '')"
                :kyt-pic="kyt.user_name || ''"
                :kyt-potensi="kyt.potensi || ''"
                :kyt-penanganan="kyt.penanganan || ''"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-pink-50 p-4 rounded-lg">
                <h4 class="text-sm font-semibold text-pink-800 mb-2">Judul KYT</h4>
                <p class="text-base font-medium break-words">{{ kyt.title }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="text-sm font-semibold text-gray-800 mb-2">Disampaikan Oleh</h4>
                <p class="text-base break-words">{{ kyt.user_name }}</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg md:col-span-2">
                <h4 class="text-sm font-semibold text-blue-800 mb-2">Potensi Bahaya</h4>
                <p class="text-base whitespace-pre-line break-words">{{ kyt.potensi }}</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg md:col-span-2">
                <h4 class="text-sm font-semibold text-green-800 mb-2">Penanganan</h4>
                <p class="text-base whitespace-pre-line break-words">{{ kyt.penanganan }}</p>
              </div>
            </div>

            <template v-if="kyt.penanganans">
              <div class="flex items-center pt-4 justify-between border-b-2 border-pink-200 pb-3">
                <h3 class="text-xl font-bold text-yellow-600">Penanganan:</h3>
              </div>
              <div class="px-2 md:px-6">
                <div class="rounded-lg overflow-auto shadow-lg bg-gray-100">
                  <img :src="assetUrl(kyt.penanganans.result_path, { query: { t: dateparams } })" :alt="kyt.penanganans.title" class="w-full h-auto" />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center pt-4 justify-between border-b-2 border-pink-200 pb-3">
                <h3 class="text-xl font-bold text-yellow-600">Belum Ada Penanganan</h3>
              </div>
            </template>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>
