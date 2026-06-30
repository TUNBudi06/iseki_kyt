<script setup lang="ts">
import LeaderLayout from '@/Layouts/LeaderLayout.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList,
} from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { router, Head, Link } from '@inertiajs/vue3'
import { routeUrl } from '@tunbudi06/inertia-route-helper'
import leader, { kytdelete, penanangananedit } from '$routes/leader'
import { toast } from 'vue-sonner'
import ModalKYTShow from '$lib/component/ModalKYTShow.vue'
import { downloadKytImage } from '$lib/download/KytImage.ts'
import { downloadKytPptx } from '$lib/download/KytPptx.ts'
import { ref, computed, watch, onMounted } from 'vue'

interface TeamData {
  team_name?: string
  id?: number | string
}

interface KytListDate {
  id?: number | string
  kyt_date?: string
  created_at?: string
  number_of_Weeks?: number
  kyt_lists?: KytEntry[]
}

interface KytEntry {
  id?: number | string
  result_path?: string
  title?: string
  user_name?: string
  penanganans?: { id?: number | string; penanganan_title?: string; foto_path?: string; result_path?: string; title?: string } | null
}

interface FormattedRow {
  [key: string]: unknown
  id?: number | string
  kyt_date?: string
  created_at?: string
  number_of_Weeks?: number
  kyt_lists: KytEntry | null
  formatted_date: string
  weeks: string
  formatted_created: string
  status_text: string
  status_color: string
  has_submission: boolean
  need_penanganan: boolean
  penanganan_id: number | string | null
}

interface MonthItem {
  value?: string
  label?: string
}

const props = defineProps<{
  kytListDates: KytListDate[]
  team: TeamData | null
  availableMonths: MonthItem[]
  selectedMonthYear: string
  bgKyt: string
}>()

const dateparams = ref(0)
onMounted(() => { dateparams.value = Date.now() })

const monthFilter = ref('')
watch(() => props.selectedMonthYear, (val) => { monthFilter.value = val }, { immediate: true })

const isViewDialogOpen = ref(false)
const selectedKyt = ref(null)

function viewKyt(kytData: KytEntry) {
  selectedKyt.value = kytData
  isViewDialogOpen.value = true
}

function deleteKyt(kytId: number | string) {
  if (confirm('Are you sure you want to delete this KYT? This action cannot be undone.')) {
    router.delete(routeUrl(kytdelete({ id: kytId })), {
      onSuccess: () => toast.success('KYT deleted successfully!'),
      onError: (errors) => {
        const errorMsg = Object.values(errors).flat().join(', ')
        toast.error(errorMsg || 'Failed to delete KYT')
      },
    })
  }
}

async function downloadAsImage(kytData: KytEntry) {
  await downloadKytImage({ result_path: kytData.result_path, title: kytData.title }, dateparams.value)
}

async function downloadAsPPT(kytData: KytEntry) {
  const pptx = await downloadKytPptx(kytData, props.team)
  try {
    await pptx.writeFile({ fileName: `KYT_${kytData.title.replace(/\s+/g, '-')}.pptx` })
    toast.success('PowerPoint downloaded successfully!')
  } catch (error) {
    toast.error('Failed to download PowerPoint')
    console.error('PPT Download error:', error)
  }
}

// Month filter
function changeMonth(direction: number) {
  const current = monthFilter.value || props.selectedMonthYear
  if (!current) return
  const [year, month] = current.split('-').map(Number)
  const d = new Date(year, month - 1 + direction, 1)
  monthFilter.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

watch(monthFilter, (val) => {
  if (val !== props.selectedMonthYear && val !== '') {
    router.get(routeUrl(leader.kyt({ query: { month_year: val } })), {}, {
      preserveState: true, preserveScroll: true,
    })
  }
})

// Data formatting
const formattedData = computed(() => {
  return (props.kytListDates || []).map((dateList: KytListDate): FormattedRow => {
    const kytEntries = dateList.kyt_lists || []
    const hasSubmission = kytEntries.length > 0
    const penanganans = hasSubmission ? kytEntries[0].penanganans : null
    let statusText = 'Not Submitted'
    let statusColor = 'red'

    if (penanganans) {
      statusText = 'Submitted'
      statusColor = 'green'
    } else if (hasSubmission) {
      statusText = 'menunggu penanganan'
      statusColor = 'yellow'
    }

    return {
      ...dateList,
      kyt_lists: dateList.kyt_lists ? dateList.kyt_lists[0] : null,
      formatted_date: new Date(dateList.kyt_date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
      weeks: new Date(dateList.kyt_date).toLocaleDateString('id-ID', { month: 'long' }) + ' Minggu Ke ' + dateList.number_of_Weeks,
      formatted_created: new Date(dateList.created_at).toLocaleDateString('id-ID'),
      status_text: statusText,
      status_color: statusColor,
      has_submission: hasSubmission,
      need_penanganan: hasSubmission && !penanganans,
      penanganan_id: penanganans ? penanganans.id : null,
    }
  })
})

// Search/filter
const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return formattedData.value
  const q = search.value.toLowerCase()
  return formattedData.value.filter((row: FormattedRow) =>
    String(row.id).includes(q) ||
    (row.formatted_date || '').toLowerCase().includes(q) ||
    (row.status_text || '').toLowerCase().includes(q) ||
    (row.weeks || '').toLowerCase().includes(q)
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
</script>

<template>
  <Head>
    <title>KYT Lists - Leader Dashboard</title>
  </Head>

  <LeaderLayout>
    <Card class="shadow-xl">
      <CardHeader class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
        <div class="flex justify-between w-full items-center">
          <div>
            <CardTitle class="text-2xl font-bold text-white">KYT History</CardTitle>
            <CardDescription class="text-pink-50">
              <template v-if="team">View KYT history for {{ team.team_name }}</template>
              <template v-else>View all KYT history</template>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-6">
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

        <div class="overflow-x-auto">
          <Table>
            <TableCaption>A list of KYT dates and weeks.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead class="w-16 px-2 py-2 text-xs">ID</TableHead>
                <TableHead class="px-3 py-2 text-xs">KYT Date</TableHead>
                <TableHead class="px-3 py-2 text-xs">Week Number</TableHead>
                <TableHead class="px-3 py-2 text-xs">Status</TableHead>
                <TableHead class="text-end px-3 py-2 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in paginatedData" :key="row.id" class="hover:bg-muted/50">
                <TableCell class="font-medium px-2 py-2 text-xs">{{ row.id }}</TableCell>
                <TableCell class="px-3 py-2 text-xs text-balance">{{ row.formatted_date }}</TableCell>
                <TableCell class="px-3 py-2 text-xs">{{ row.weeks }}</TableCell>
                <TableCell class="px-3 py-2">
                  <Badge v-if="row.has_submission" :class="row.status_color === 'green' ? 'bg-green-500' : row.status_color === 'yellow' ? 'bg-yellow-300 text-black' : ''" class="text-xs px-2 py-0.5">{{ row.status_text }}</Badge>
                  <Badge v-else variant="secondary" class="text-xs px-2 py-0.5">{{ row.status_text }}</Badge>
                </TableCell>
                <TableCell class="text-end px-3 py-2">
                  <template v-if="row.has_submission">
                    <div class="flex gap-1 justify-end flex-wrap">
                      <Button variant="outline" size="sm" @click="viewKyt(row.kyt_lists)" class="flex items-center gap-1 h-8 px-2 text-xs">
                        View
                      </Button>
                      <Link :href="routeUrl(leader.kytedit({ id: row.kyt_lists.id }))">
                        <Button variant="outline" size="sm" class="flex items-center gap-1 h-8 px-2 text-xs">Edit</Button>
                      </Link>
                      <template v-if="row.need_penanganan">
                        <Link :href="routeUrl(leader.penangananadd({ kytListId: row.kyt_lists.id }))">
                          <Button variant="outline" size="sm" class="flex items-center gap-1 h-8 px-2 text-xs bg-yellow-50 hover:bg-yellow-100">Penanganan</Button>
                        </Link>
                      </template>
                      <template v-else-if="row.has_submission && row.penanganan_id">
                        <Link :href="routeUrl(penanangananedit({ id: row.penanganan_id }))">
                          <Button variant="outline" size="sm" class="flex items-center gap-1 h-8 px-2 text-xs bg-green-50 hover:bg-green-100">Edit Penanganan</Button>
                        </Link>
                      </template>
                      <Button variant="outline" size="sm" @click="downloadAsImage(row.kyt_lists)" class="flex items-center gap-1 h-8 px-2 text-xs bg-blue-50 hover:bg-blue-100">Image</Button>
                      <Button variant="outline" size="sm" @click="downloadAsPPT(row.kyt_lists)" class="flex items-center gap-1 h-8 px-2 text-xs bg-orange-50 hover:bg-orange-100">PPT</Button>
                      <Button variant="destructive" size="sm" @click="deleteKyt(row.kyt_lists.id)" class="flex items-center gap-1 h-8 px-2 text-xs">Delete</Button>
                    </div>
                  </template>
                  <template v-else>
                    <Link :href="routeUrl(leader.kytadd({ IdKytDate: row.id }))">
                      <Button size="sm" class="flex items-center self-end gap-1 h-8 px-2 text-xs">Tambahkan KYT</Button>
                    </Link>
                  </template>
                </TableCell>
              </TableRow>
              <TableRow v-if="paginatedData.length === 0">
                <TableCell colspan="5" class="text-center py-8 text-gray-500">No data available</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <!-- Pagination -->
          <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>Showing {{ paginatedData.length }} of {{ filteredData.length }} entries</div>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="currentPage--">Previous</Button>
              <span class="flex items-center px-3">{{ currentPage }} / {{ totalPages }}</span>
              <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="currentPage++">Next</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    <ModalKYTShow v-model:is-open="isViewDialogOpen" :selected-kyt="selectedKyt" :team="team" :bg-kyt="bgKyt" />
  </LeaderLayout>
</template>
