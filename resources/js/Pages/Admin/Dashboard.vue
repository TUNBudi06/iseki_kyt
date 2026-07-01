<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import KytPreview from '@/Components/KytPreview.vue'
import { usePage, Head } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { assetUrl } from '@tunbudi06/inertia-route-helper'
import { computed, ref, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'

interface WeekItem {
  id: number | string
  date_start?: string
  date_end?: string
  week_number?: number
  start: Date
  end: Date
}

interface KytEntry {
  image?: string
  title?: string
  desc?: string
  submittedBy?: string
  foto_path?: string
  penanganan?: string
}

interface TeamItem {
  id?: number | string
  name?: string
  desc?: string
  weeklyKYT: Record<string, KytEntry | null>
}

interface SelectedKyt extends KytEntry {
  teamName?: string
  weekNumber?: number
  weekStart: Date
  weekEnd: Date
}

const page = usePage<{ auth?: { user?: { username?: string } }; flash?: { success?: string; error?: string } }>()

const props = defineProps<{
  weeksInCurrentMonth: WeekItem[]
  teams: TeamItem[]
  currentYear: string | number
  currentMonthName: string
  bgKyt: string
}>()

// Watch for flash messages
watch(() => page.props.flash?.success, (val) => {
  if (val) toast.success(val)
})
watch(() => page.props.flash?.error, (val) => {
  if (val) toast.error(val)
})

const isDialogOpen = ref(false)
const selectedKyt = ref<SelectedKyt | null>(null)
const dateparams = ref(0)

onMounted(() => { dateparams.value = Date.now() })

const weeks = computed(() => {
  if (!props.weeksInCurrentMonth || props.weeksInCurrentMonth.length === 0) {
    const currentDate = new Date()
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const monthIndex = monthNames.indexOf(props.currentMonthName)
    const month = monthIndex >= 0 ? monthIndex : currentDate.getMonth()
    const year = parseInt(String(props.currentYear)) || currentDate.getFullYear()
    const generatedWeeks = []
    for (let i = 0; i < 4; i++) {
      const startDay = i * 7 + 1
      const endDay = Math.min((i + 1) * 7, new Date(year, month + 1, 0).getDate())
      generatedWeeks.push({
        id: i + 1,
        date_start: `${year}-${String(month + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
        date_end: `${year}-${String(month + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
        start: new Date(year, month, startDay),
        end: new Date(year, month, endDay),
        week_number: i + 1,
      })
    }
    return generatedWeeks
  }

  return props.weeksInCurrentMonth.map((week, i) => ({
    id: week.id ?? `fallback-${i}`,
    date_start: week.date_start || '',
    date_end: week.date_end || '',
    start: new Date(week.date_start || ''),
    end: new Date(week.date_end || ''),
    week_number: week.week_number || (i + 1),
  }))
})

const gridColsClass = computed(() =>
  weeks.value.length === 4
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
)

function formatWeekRange(start: Date, end: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`
}

function getMonthName(date: Date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[date.getMonth()]
}

function isNextMonth(week: WeekItem, monthName: string) {
  return getMonthName(week.start) !== monthName
}

function kytEntry(team: TeamItem, weekId: number | string): KytEntry | undefined {
  return team.weeklyKYT[weekId] || undefined
}

function openKytDialog(kytData: KytEntry, weekNumber: number, weekStart: Date, weekEnd: Date, teamName: string) {
  selectedKyt.value = { ...kytData, weekNumber, weekStart, weekEnd, teamName }
  isDialogOpen.value = true
}
</script>

<template>
  <Head>
    <title>Admin Dashboard</title>
  </Head>

  <AdminLayout>
    <div class="space-y-4 md:space-y-6 px-2 sm:px-0 overflow-x-hidden">
      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          List KYT {{ currentMonthName }} {{ currentYear }}
        </h1>
        <p class="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
          KIKEN YOCHI TRAINING (KYT)
        </p>
      </div>

      <!-- Each Team gets a Card Row -->
      <Card
        v-for="team in teams"
        :key="team.id || team.name"
        class="border-2 hover:border-pink-600/50 transition-colors"
      >
        <CardHeader class="bg-linear-to-r from-pink-50 to-blue-50 p-4 md:p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div class="w-full sm:w-auto">
              <CardTitle class="text-xl sm:text-2xl font-bold text-pink-600">
                {{ team.name }}
              </CardTitle>
              <CardDescription class="whitespace-pre-line text-sm md:text-base mt-1">
                {{ team.desc }}
              </CardDescription>
            </div>
            <div class="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-auto justify-between sm:justify-end">
              <span class="text-xs sm:text-sm font-medium text-muted-foreground">
                {{ weeks.length }} Minggu
              </span>
              <div class="flex items-center gap-1 text-xs">
                <span class="bg-green-600 text-white px-2 py-0.5 rounded font-semibold">
                  ✓ {{ Object.values(team.weeklyKYT).filter(k => k !== null).length }}
                </span>
                <span v-if="weeks.length - Object.values(team.weeklyKYT).filter(k => k !== null).length > 0"
                  class="bg-gray-500 text-white px-2 py-0.5 rounded font-semibold">
                  ✗ {{ weeks.length - Object.values(team.weeklyKYT).filter(k => k !== null).length }}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-4 md:pt-6 p-3 md:p-6">
          <div class="grid gap-2 md:gap-3 justify-center" :class="gridColsClass">
            <div
              v-for="(week, weekIndex) in weeks"
              :key="weekIndex"
              :class="[
                'rounded-xl md:rounded-2xl relative aspect-4/3 overflow-hidden group cursor-pointer transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-pink-600',
                isNextMonth(week, currentMonthName) ? 'ring-2 ring-blue-400' : '',
              ]"
              role="button"
              tabindex="0"
              @click="team.weeklyKYT[week.id] ? openKytDialog(team.weeklyKYT[week.id]!, week.week_number || weekIndex + 1, week.start, week.end, team.name) : undefined"
            >
              <template v-if="team.weeklyKYT[week.id]">
                <!-- KYT Submitted -->
                <img
                  :src="assetUrl(team.weeklyKYT[week.id].image, { query: { t: dateparams } })"
                  :alt="team.weeklyKYT[week.id].title"
                  class="w-full h-full object-contain"
                />
                <div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20"></div>
                <div v-if="isNextMonth(week, currentMonthName)"
                  class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-lg">
                  {{ getMonthName(week.start) }}
                </div>
                <div class="absolute pb-3 px-3 sm:pb-4 sm:px-4 md:pb-5 md:px-5 inset-x-0 bottom-0 flex flex-col justify-end space-y-2 sm:space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <span class="bg-pink-600 text-white text-xs sm:text-sm md:text-base font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded w-fit">
                      Minggu {{ week.week_number || weekIndex + 1 }}
                    </span>
                    <span class="text-white/70 text-xs sm:text-sm">
                      {{ formatWeekRange(week.start, week.end) }}
                    </span>
                  </div>
                  <h3 class="text-white font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-2">
                    {{ team.weeklyKYT[week.id].title }}
                  </h3>
                  <p class="text-white/80 text-xs sm:text-sm md:text-base leading-tight line-clamp-2">
                    {{ team.weeklyKYT[week.id].desc }}
                  </p>
                  <div class="border-t border-white/20 my-1 sm:my-2"></div>
                  <div class="flex items-center text-xs sm:text-sm">
                    <span class="text-white/70 truncate">📝 {{ team.weeklyKYT[week.id].submittedBy }}</span>
                  </div>
                </div>
                <div class="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/10 transition-colors duration-300"></div>
              </template>
              <template v-else>
                <!-- Empty state -->
                <div class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 relative">
                  <div v-if="isNextMonth(week, currentMonthName)"
                    class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-lg">
                    {{ getMonthName(week.start) }}
                  </div>
                  <div class="text-center space-y-2 sm:space-y-3">
                    <div class="text-3xl sm:text-4xl md:text-5xl opacity-30">📋</div>
                    <div class="bg-gray-300 text-gray-600 text-xs sm:text-sm md:text-base font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded">
                      Minggu {{ week.week_number || weekIndex + 1 }}
                    </div>
                    <p class="text-xs sm:text-sm text-gray-500 font-medium">{{ formatWeekRange(week.start, week.end) }}</p>
                    <div class="pt-2 sm:pt-3">
                      <p class="text-xs sm:text-sm font-semibold text-gray-600">Belum Submit</p>
                      <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">KYT minggu ini</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- View KYT Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle class="text-2xl font-bold text-pink-600">
            KYT Details - {{ selectedKyt?.title || '' }}
          </DialogTitle>
          <DialogDescription v-if="selectedKyt">
            <div class="flex flex-wrap gap-2 text-sm">
              <span class="font-semibold">Team: {{ selectedKyt.teamName }}</span>
              <span> • </span>
              <span>Week {{ selectedKyt.weekNumber }}</span>
              <span> • </span>
              <span>{{ formatWeekRange(selectedKyt.weekStart, selectedKyt.weekEnd) }}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedKyt" class="py-4 px-2 md:px-6 min-w-0 overflow-x-hidden">
          <KytPreview
            :scale-to-fit="true"
            :bg-kyt="bgKyt"
            :kyt-date="selectedKyt.weekStart"
            :kyt-team="selectedKyt.teamName"
            :kyt-title="selectedKyt.title"
            :saved-image-url="selectedKyt.foto_path ? assetUrl(selectedKyt.foto_path, { query: { t: dateparams } }) : (selectedKyt.image ? assetUrl(selectedKyt.image, { query: { t: dateparams } }) : '')"
            :kyt-pic="selectedKyt.submittedBy"
            :kyt-potensi="selectedKyt.desc"
            :kyt-penanganan="selectedKyt.penanganan || ''"
          />
        </div>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>
