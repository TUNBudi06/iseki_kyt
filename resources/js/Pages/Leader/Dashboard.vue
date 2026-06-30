<script setup lang="ts">
import LeaderLayout from '@/Layouts/LeaderLayout.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import KytPreview from '@/Components/KytPreview.vue'
import { usePage, Link, Head } from '@inertiajs/vue3'
import { assetUrl, routeUrl } from '@tunbudi06/inertia-route-helper'
import leader, { kytadd, kytedit } from '$routes/leader'
import { computed, ref, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'

interface WeekRaw {
  id?: number | string
  date_start?: string
  date_end?: string
  week_number?: number
}

interface WeekItem {
  id?: number | string
  start: Date
  end: Date
  week_number?: number
}

interface KytEntry {
  image_url?: string
  title?: string
  foto_path?: string
  user_name?: string
  potensi?: string
  penanganan?: string
  status?: boolean | number
  id?: number | string
  submitted_at?: string
  kyt_date_id?: string | number
}

interface TeamData {
  team_name?: string
  weeklyKYT?: Record<string, KytEntry | null>
}

interface SelectedKytData extends KytEntry {
  weekNumber?: number
  week: WeekItem
}

const page = usePage<{ auth?: { user?: { username?: string } }; flash?: { success?: string; error?: string } }>()

// Watch for flash messages
watch(() => page.props.flash?.success, (val) => {
  if (val) toast.success(val)
})
watch(() => page.props.flash?.error, (val) => {
  if (val) toast.error(val)
})

const props = defineProps<{
  weeksInCurrentMonth: WeekRaw[]
  team: TeamData | null
  currentYear: string | number
  currentMonthName: string
  bgKyt: string
}>()

const isDialogOpen = ref(false)
const selectedKyt = ref<SelectedKytData | null>(null)
const dateparams = ref(0)

onMounted(() => { dateparams.value = Date.now() })

function openKytDialog(kytData: KytEntry, weekNumber: number, week: WeekItem) {
  selectedKyt.value = { ...kytData, weekNumber, week }
  isDialogOpen.value = true
}

const weeks = computed<WeekItem[]>(() => {
  const generatedWeeks: WeekItem[] = []
  for (let i = 0; i < props.weeksInCurrentMonth.length; i++) {
    const week = props.weeksInCurrentMonth[i]
    generatedWeeks.push({
      id: week.id,
      start: new Date(week.date_start || ''),
      end: new Date(week.date_end || ''),
      week_number: week.week_number || (i + 1),
    })
  }
  return generatedWeeks
})

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

const totalKytThisMonth = computed(() => weeks.value.length)
const kytSubmitted = computed(() => {
  if (!props.team?.weeklyKYT) return 0
  return Object.values(props.team.weeklyKYT).filter((k): k is KytEntry => k !== null && !!k?.image_url).length
})
const kytNotSubmitted = computed(() => weeks.value.length - kytSubmitted.value)
</script>

<template>
  <Head>
    <title>Dashboard - Leader Panel</title>
    <meta name="description" content="Leader dashboard for managing KYT submissions" />
  </Head>

  <LeaderLayout>
    <div class="space-y-6 overflow-x-hidden">
      <!-- Welcome Section -->
      <div class="bg-linear-to-r from-pink-500 to-pink-600 rounded-lg p-8 text-white">
        <h1 class="text-3xl font-bold mb-2">
          Welcome back, {{ page.props.auth?.user?.username || 'Leader' }}!
        </h1>
        <p class="text-pink-100">
          Manage your team's KYT submissions and track safety initiatives
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="border-2 border-pink-200">
          <CardHeader>
            <CardTitle class="text-pink-600">Total KYT</CardTitle>
            <CardDescription>This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-4xl font-bold text-pink-600">{{ totalKytThisMonth }}</div>
          </CardContent>
        </Card>

        <Card class="border-2 border-pink-200">
          <CardHeader>
            <CardTitle class="text-pink-600">KYT Yang disubmit</CardTitle>
            <CardDescription>Submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-4xl font-bold text-pink-600">{{ kytSubmitted }}</div>
          </CardContent>
        </Card>

        <Card class="border-2 border-pink-200">
          <CardHeader>
            <CardTitle class="text-pink-600">KYT Belum DiSubmit</CardTitle>
            <CardDescription>Not Submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-4xl font-bold text-pink-600">{{ kytNotSubmitted }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Weekly KYT Submissions -->
      <Card>
        <CardHeader class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle class="text-2xl font-bold text-white">
            {{ team?.team_name || 'Team' }} - KYT This Month
          </CardTitle>
          <CardDescription class="text-pink-50">
            {{ currentMonthName }} {{ currentYear }} - Weekly submissions
          </CardDescription>
        </CardHeader>
        <CardContent class="pt-6">
          <template v-if="team && team.weeklyKYT">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div
                v-for="(week, weekIndex) in weeks"
                :key="weekIndex"
                class="group relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                :class="isNextMonth(week, currentMonthName) ? 'ring-2 ring-blue-400' : ''"
              >
                <template v-if="team.weeklyKYT[week.id] && team.weeklyKYT[week.id].image_url">
                  <!-- Submitted -->
                  <img
                    :src="assetUrl(team.weeklyKYT[week.id].image_url, { query: { t: dateparams } })"
                    :alt="'KYT Week ' + (week.week_number || weekIndex + 1)"
                    class="w-full h-full object-contain"
                  />
                  <div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20"></div>
                  <div v-if="isNextMonth(week, currentMonthName)" class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 rounded font-bold shadow-lg">
                    {{ getMonthName(week.start) }}
                  </div>
                  <div class="absolute pb-2 px-3 sm:pb-3 sm:px-4 inset-x-0 bottom-0 flex flex-col justify-end space-y-1">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span class="bg-pink-600 text-white text-sm sm:text-base md:text-lg font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded w-fit shadow-lg">
                        Minggu {{ week.week_number || weekIndex + 1 }}
                      </span>
                      <span class="text-white/90 text-xs sm:text-sm md:text-base font-medium">
                        {{ formatWeekRange(week.start, week.end) }}
                      </span>
                    </div>
                    <div class="flex items-center text-xs sm:text-sm md:text-base">
                      <span v-if="team.weeklyKYT[week.id].status" class="text-white/90 font-medium">✅ Submitted</span>
                      <span v-else class="text-white font-medium">⛔ Menunggu penanganan</span>
                    </div>
                  </div>
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <button
                      @click="openKytDialog(team.weeklyKYT[week.id], week.week_number || weekIndex + 1, week)"
                      class="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base md:text-lg flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                      Lihat KYT
                    </button>
                  </div>
                </template>
                <template v-else>
                  <!-- Not submitted -->
                  <div class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-3 sm:p-4 relative">
                    <div v-if="isNextMonth(week, currentMonthName)" class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 rounded font-bold shadow-lg">
                      {{ getMonthName(week.start) }}
                    </div>
                    <div class="text-center space-y-2">
                      <div class="text-4xl sm:text-5xl md:text-6xl opacity-30">📋</div>
                      <div class="text-sm sm:text-base md:text-lg font-bold text-gray-600">Minggu {{ week.week_number || weekIndex + 1 }}</div>
                      <div class="text-xs sm:text-sm md:text-base text-gray-500 font-medium">{{ formatWeekRange(week.start, week.end) }}</div>
                      <div class="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300/50 rounded text-xs sm:text-sm md:text-base text-gray-600 font-semibold">Belum Submit</div>
                    </div>
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <Link
                        :href="routeUrl(kytadd({ IdKytDate: team.weeklyKYT[week.id]?.kyt_date_id || '' }))"
                        class="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base md:text-lg flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Tambahkan KYT
                      </Link>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <div v-else class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-lg">No team data available</p>
            <p class="text-sm text-gray-400">Please contact administrator</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- KYT Detail Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="md:max-w-5xl xl:max-w-7xl max-h-[90vh] overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle class="text-2xl font-bold text-pink-600">
            Preview KYT - Minggu {{ selectedKyt?.weekNumber }}
          </DialogTitle>
          <DialogDescription v-if="selectedKyt">
            {{ formatWeekRange(selectedKyt.week.start, selectedKyt.week.end) }} · {{ team?.team_name || 'Team' }}
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedKyt" class="py-4 px-2 md:px-6 space-y-6">
          <div>
            <KytPreview
              :scale-to-fit="true"
              :bg-kyt="bgKyt"
              :kyt-date="selectedKyt.week.start"
              :kyt-team="team?.team_name || ''"
              :kyt-title="selectedKyt.title || ''"
              :saved-image-url="selectedKyt.foto_path ? assetUrl(selectedKyt.foto_path, { query: { t: dateparams } }) : (selectedKyt.image_url ? assetUrl(selectedKyt.image_url, { query: { t: dateparams } }) : '')"
              :kyt-pic="selectedKyt.user_name || ''"
              :kyt-potensi="selectedKyt.potensi || ''"
              :kyt-penanganan="selectedKyt.penanganan || ''"
            />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">
            <div class="flex flex-wrap items-center gap-2">
              <template v-if="!selectedKyt.status">
                <Link :href="routeUrl(leader.penangananadd({ kytListId: selectedKyt.id }))">
                  <Button variant="outline" class="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Add Penanganan
                  </Button>
                </Link>
              </template>
              <Link :href="routeUrl(kytedit({ id: selectedKyt.id }))">
                <Button variant="outline" class="flex items-center gap-2 bg-blue-50 hover:bg-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit KYT
                </Button>
              </Link>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">
                <template v-if="selectedKyt.status">✅ Submitted</template>
                <template v-else>⛔ Menunggu penanganan</template>
              </span>
              <span v-if="selectedKyt.submitted_at" class="text-xs text-muted-foreground">
                {{ new Date(selectedKyt.submitted_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </LeaderLayout>
</template>
