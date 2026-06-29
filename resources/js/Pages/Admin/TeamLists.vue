<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { router, useForm, Link, Head, usePage } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import { add as addTeam, edit as editTeam, deleteMethod as deleteTeam } from '$routes/admin/team'
import { list as userList } from '$routes/admin/user'
import { route, routeUrl } from '@tunbudi06/inertia-route-helper'
import { ref, computed, watch, onMounted } from 'vue'

const page = usePage()
const props = defineProps({
  teams: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
})

// Reactive data
const data = ref([])
watch(() => props.teams, (val) => { data.value = val || [] }, { immediate: true })

// Search/filter
const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(row =>
    String(row.id).includes(q) ||
    (row.team_name || '').toLowerCase().includes(q) ||
    (row.team_description || '').toLowerCase().includes(q) ||
    (row.user?.username || '').toLowerCase().includes(q)
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

// Sorting
const sortField = ref('')
const sortDir = ref('asc')
function toggleSort(field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
}
const sortedData = computed(() => {
  if (!sortField.value) return paginatedData.value
  return [...paginatedData.value].sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    if (aVal < bVal) return sortDir.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
})

// Form state
const form = useForm({ team_name: '', team_description: '', user_id: '' })
const editForm = useForm({ team_name: '', team_description: '', user_id: '' })

const editingTeamId = ref(null)
const deletingTeamId = ref(null)
const openAdd = ref(false)
const openEdit = ref(false)
const openDelete = ref(false)

const userOptions = computed(() =>
  (props.users || []).map(u => ({ value: String(u.id), label: u.username }))
)

function submitButton(e) {
  e.preventDefault()
  form.post(route(addTeam()).url, {
    onSuccess: () => {
      openAdd.value = false
      form.reset()
      toast.success('Team berhasil ditambahkan', { id: 'add-team-success' })
      router.reload({ only: ['teams'] })
    },
  })
}

function submitEditButton(e) {
  e.preventDefault()
  if (editingTeamId.value === null) return
  editForm.put(route(editTeam(editingTeamId.value)).url, {
    onSuccess: () => {
      openEdit.value = false
      editingTeamId.value = null
      editForm.reset()
      toast.success('Team berhasil diupdate', { id: 'edit-team-success' })
      router.reload({ only: ['teams'] })
    },
  })
}

function confirmDelete() {
  if (deletingTeamId.value === null) return
  router.delete(route(deleteTeam(deletingTeamId.value)).url, {
    onSuccess: () => {
      openDelete.value = false
      deletingTeamId.value = null
      toast.success('Team berhasil dihapus', { id: 'delete-team-success' })
      router.reload({ only: ['teams'] })
    },
    onError: (errors) => {
      openDelete.value = false
      deletingTeamId.value = null
      toast.error('Gagal menghapus team: ' + (errors?.message || 'Unknown error'), { id: 'delete-team-error' })
    },
  })
}

function openEditDialog(team) {
  editingTeamId.value = team.id
  editForm.team_name = team.team_name
  editForm.team_description = team.team_description || ''
  editForm.user_id = String(team.user_id || '')
  openEdit.value = true
}

function openDeleteDialog(teamId) {
  deletingTeamId.value = teamId
  openDelete.value = true
}

function sortIcon(field) {
  if (sortField.value !== field) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}
</script>

<template>
  <Head>
    <title>Team Lists - Admin Panel</title>
    <meta name="description" content="Admin panel for managing teams." />
  </Head>

  <AdminLayout>
    <Card class="shadow-xl">
      <CardHeader class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
        <div class="flex justify-between w-full items-center">
          <div>
            <CardTitle class="text-2xl font-bold text-white">Team Lists</CardTitle>
            <CardDescription class="text-pink-50">Manage and view all teams.</CardDescription>
          </div>
          <div>
            <Link :href="routeUrl(userList())">
              <Button class="bg-white text-pink-600 hover:bg-pink-50 font-semibold shadow-lg transform hover:scale-105 transition-all">
                Manage Users
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-6">
        <div class="flex items-center justify-between mb-4">
          <Button @click="openAdd = true" class="bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer">
            + Tambah Team
          </Button>
          <Input v-model="search" placeholder="Cari Team..." class="max-w-xs" />
        </div>

        <div class="mt-4 rounded-lg overflow-hidden shadow-lg">
          <Table class="w-full" data-table-bordered>
            <TableHeader class="bg-linear-to-r from-pink-500 to-pink-600">
              <TableRow class="hover:bg-transparent">
                <TableHead class="px-6 py-4 text-left font-semibold text-white cursor-pointer hover:text-pink-200" @click="toggleSort('id')">
                  No {{ sortIcon('id') }}
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white cursor-pointer hover:text-pink-200" @click="toggleSort('team_name')">
                  Name {{ sortIcon('team_name') }}
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white cursor-pointer hover:text-pink-200" @click="toggleSort('team_description')">
                  Description {{ sortIcon('team_description') }}
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white">
                  PIC
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(row, idx) in sortedData" :key="row.id"
                :class="idx % 2 === 0 ? 'bg-white hover:bg-pink-50 transition-colors' : 'bg-pink-100 hover:bg-pink-200 transition-colors'">
                <TableCell class="px-6 py-4 text-gray-900">{{ idx + 1 + (currentPage - 1) * pageSize }}</TableCell>
                <TableCell class="px-6 py-4 text-gray-900 font-medium">{{ row.team_name }}</TableCell>
                <TableCell class="px-6 py-4 text-gray-700">{{ row.team_description || '-' }}</TableCell>
                <TableCell class="px-6 py-4">
                  <span v-if="row.user" class="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500 text-white">
                    {{ row.user.username }}
                  </span>
                  <span v-else class="text-gray-400">No PIC</span>
                </TableCell>
                <TableCell class="px-6 py-4">
                  <div class="flex gap-2">
                    <Button size="sm" variant="outline" class="bg-blue-500 hover:bg-blue-600 text-white border-blue-500" @click="openEditDialog(row)">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" class="bg-red-500 hover:bg-red-600 text-white border-red-500" @click="openDeleteDialog(row.id)">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="sortedData.length === 0">
                <TableCell colspan="5" class="text-center py-8 text-gray-500">Team tidak ditemukan</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            Showing {{ sortedData.length }} of {{ filteredData.length }} entries
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="currentPage--">Previous</Button>
            <span class="flex items-center px-3">{{ currentPage }} / {{ totalPages }}</span>
            <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="currentPage++">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Add Team Dialog -->
    <Dialog v-model:open="openAdd">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambahkan Team</DialogTitle>
          <DialogDescription>Isi form dibawah untuk menambahkan team baru.</DialogDescription>
        </DialogHeader>
        <form @submit="submitButton">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="team_name">Team Name</Label>
              <Input id="team_name" v-model="form.team_name" type="text" placeholder="DST" />
              <p v-if="form.errors.team_name" class="text-sm text-red-500">{{ form.errors.team_name }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="team_description">Description</Label>
              <Input id="team_description" v-model="form.team_description" placeholder="Team description..." />
              <p v-if="form.errors.team_description" class="text-sm text-red-500">{{ form.errors.team_description }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="user_id">PIC (Person In Charge)</Label>
              <Select v-model="form.user_id">
                <SelectTrigger id="user_id">
                  <SelectValue placeholder="Select PIC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="u in userOptions" :key="u.value" :value="u.value">
                    {{ u.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="form.errors.user_id" class="text-sm text-red-500">{{ form.errors.user_id }}</p>
            </div>
            <Button type="submit" :disabled="form.processing" class="w-full">
              {{ form.processing ? 'Menyimpan...' : 'Tambah Team' }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Edit Team Dialog -->
    <Dialog v-model:open="openEdit">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>Update informasi team.</DialogDescription>
        </DialogHeader>
        <form @submit="submitEditButton">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="edit-team_name">Team Name</Label>
              <Input id="edit-team_name" v-model="editForm.team_name" type="text" placeholder="DST" />
              <p v-if="editForm.errors.team_name" class="text-sm text-red-500">{{ editForm.errors.team_name }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="edit-team_description">Description</Label>
              <Input id="edit-team_description" v-model="editForm.team_description" placeholder="Team description..." />
              <p v-if="editForm.errors.team_description" class="text-sm text-red-500">{{ editForm.errors.team_description }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="edit-user_id">PIC (Person In Charge)</Label>
              <Select v-model="editForm.user_id">
                <SelectTrigger id="edit-user_id">
                  <SelectValue placeholder="Select PIC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="u in userOptions" :key="u.value" :value="u.value">
                    {{ u.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="editForm.errors.user_id" class="text-sm text-red-500">{{ editForm.errors.user_id }}</p>
            </div>
            <div class="flex gap-2">
              <Button type="submit" :disabled="editForm.processing" class="flex-1">
                {{ editForm.processing ? 'Menyimpan...' : 'Update Team' }}
              </Button>
              <Button type="button" variant="outline" class="flex-1" @click="openEdit = false">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="openDelete">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-red-600">Apakah Anda yakin?</DialogTitle>
          <DialogDescription>Tindakan ini tidak dapat dibatalkan. Team ini akan dihapus secara permanen dari database.</DialogDescription>
        </DialogHeader>
        <div class="flex gap-2 mt-6">
          <Button type="button" variant="outline" class="flex-1" @click="openDelete = false">Cancel</Button>
          <Button type="button" class="flex-1 bg-red-500 hover:bg-red-600" @click="confirmDelete">Hapus Team</Button>
        </div>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>
