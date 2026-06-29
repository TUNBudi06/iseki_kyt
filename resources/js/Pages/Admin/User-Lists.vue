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
import { router, useForm, Link, Head } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import { add as addUser, edit as editUser, deleteMethod as deleteUser } from '$routes/admin/user'
import { list as teamList } from '$routes/admin/team'
import { route, routeUrl } from '@tunbudi06/inertia-route-helper'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  users: { type: Array, default: () => [] },
})

const data = ref([])
watch(() => props.users, (val) => { data.value = val || [] }, { immediate: true })

// Search/filter
const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(row =>
    String(row.id).includes(q) ||
    (row.username || '').toLowerCase().includes(q) ||
    (row.role || '').toLowerCase().includes(q)
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

const form = useForm({ username: '', password: '', role: 'leader' })
const editForm = useForm({ username: '', password: '', role: 'leader' })

const editingUserId = ref(null)
const deletingUserId = ref(null)
const openAdd = ref(false)
const openEdit = ref(false)
const openDelete = ref(false)

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'leader', label: 'Leader' },
]

function submitButton(e) {
  e.preventDefault()
  form.post(route(addUser()).url, {
    onSuccess: () => {
      openAdd.value = false
      form.reset()
      toast.success('User berhasil ditambahkan', { id: 'add-user-success' })
      router.reload({ only: ['users'] })
    },
  })
}

function submitEditButton(e) {
  e.preventDefault()
  if (editingUserId.value === null) return
  editForm.put(route(editUser(editingUserId.value)).url, {
    onSuccess: () => {
      openEdit.value = false
      editingUserId.value = null
      editForm.reset()
      toast.success('User berhasil diupdate', { id: 'edit-user-success' })
      router.reload({ only: ['users'] })
    },
  })
}

function confirmDelete() {
  if (deletingUserId.value === null) return
  router.delete(route(deleteUser(deletingUserId.value)).url, {
    onSuccess: () => {
      openDelete.value = false
      deletingUserId.value = null
      toast.success('User berhasil dihapus', { id: 'delete-user-success' })
      router.reload({ only: ['users'] })
    },
  })
}

function openEditDialog(user) {
  editingUserId.value = user.id
  editForm.username = user.username
  editForm.password = ''
  editForm.role = user.role
  openEdit.value = true
}

function openDeleteDialog(userId) {
  deletingUserId.value = userId
  openDelete.value = true
}

function sortIcon(field) {
  if (sortField.value !== field) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}
</script>

<template>
  <Head>
    <title>User Lists - Admin Panel</title>
    <meta name="description" content="Admin panel for managing user lists." />
  </Head>

  <AdminLayout>
    <Card>
      <CardHeader>
        <div class="flex justify-between w-full">
          <div>
            <CardTitle>User Lists</CardTitle>
            <CardDescription>Manage and view all registered users.</CardDescription>
          </div>
          <div>
            <Link :href="routeUrl(teamList())">
              <Button class="transform-3d hover:scale-105">Manage Teams</Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div class="flex items-center justify-between mb-4">
          <Button @click="openAdd = true" class="cursor-pointer">Tambah User</Button>
          <Input v-model="search" placeholder="Cari User..." class="max-w-xs" />
        </div>

        <div class="mt-4 rounded-lg overflow-hidden">
          <Table class="w-full" data-table-bordered>
            <TableHeader class="bg-linear-to-r from-pink-500 to-pink-600">
              <TableRow class="hover:bg-transparent">
                <TableHead class="px-6 py-4 text-left font-semibold text-white cursor-pointer hover:text-pink-200" @click="toggleSort('id')">
                  ID {{ sortIcon('id') }}
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white cursor-pointer hover:text-pink-200" @click="toggleSort('username')">
                  UserName {{ sortIcon('username') }}
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white cursor-pointer hover:text-pink-200" @click="toggleSort('role')">
                  Role {{ sortIcon('role') }}
                </TableHead>
                <TableHead class="px-6 py-4 text-left font-semibold text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(row, idx) in sortedData" :key="row.id"
                :class="idx % 2 === 0 ? 'bg-pink-50 text-pink-900 hover:bg-pink-100' : 'bg-pink-300 text-pink-900 hover:bg-pink-400'">
                <TableCell class="px-6 py-4">{{ row.id }}</TableCell>
                <TableCell class="px-6 py-4">{{ row.username }}</TableCell>
                <TableCell class="px-6 py-4">{{ row.role }}</TableCell>
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
                <TableCell colspan="4" class="text-center py-8 text-gray-500">User tidak ditemukan</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>Showing {{ sortedData.length }} of {{ filteredData.length }} entries</div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="currentPage--">Previous</Button>
            <span class="flex items-center px-3">{{ currentPage }} / {{ totalPages }}</span>
            <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="currentPage++">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Add User Dialog -->
    <Dialog v-model:open="openAdd">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambahkan User login</DialogTitle>
          <DialogDescription>Isi form dibawah untuk menambahkan user baru.</DialogDescription>
        </DialogHeader>
        <form @submit="submitButton">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="username">Username</Label>
              <Input id="username" v-model="form.username" type="text" placeholder="Max Leiter" />
              <p v-if="form.errors.username" class="text-sm text-red-500">{{ form.errors.username }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input id="password" v-model="form.password" placeholder="••••••••" />
              <p v-if="form.errors.password" class="text-sm text-red-500">{{ form.errors.password }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="role">User Type</Label>
              <Select v-model="form.role">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in roleOptions" :key="r.value" :value="r.value">
                    {{ r.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" :disabled="form.processing" class="w-full">
              {{ form.processing ? 'Menyimpan...' : 'Tambah User' }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Edit User Dialog -->
    <Dialog v-model:open="openEdit">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update informasi user. Kosongkan password jika tidak ingin mengubahnya.</DialogDescription>
        </DialogHeader>
        <form @submit="submitEditButton">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="edit-username">Username</Label>
              <Input id="edit-username" v-model="editForm.username" type="text" placeholder="Max Leiter" />
              <p v-if="editForm.errors.username" class="text-sm text-red-500">{{ editForm.errors.username }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="edit-password">Password</Label>
              <Input id="edit-password" v-model="editForm.password" placeholder="••••••••" />
              <p v-if="editForm.errors.password" class="text-sm text-red-500">{{ editForm.errors.password }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="edit-role">User Type</Label>
              <Select v-model="editForm.role">
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in roleOptions" :key="r.value" :value="r.value">
                    {{ r.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex gap-2">
              <Button type="submit" :disabled="editForm.processing" class="flex-1">
                {{ editForm.processing ? 'Menyimpan...' : 'Update User' }}
              </Button>
              <Button type="button" variant="outline" class="flex-1" @click="openEdit = false">Cancel</Button>
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
          <DialogDescription>Tindakan ini tidak dapat dibatalkan. User ini akan dihapus secara permanen dari database.</DialogDescription>
        </DialogHeader>
        <div class="flex gap-2 mt-6">
          <Button type="button" variant="outline" class="flex-1" @click="openDelete = false">Cancel</Button>
          <Button type="button" class="flex-1 bg-red-500 hover:bg-red-600" @click="confirmDelete">Hapus User</Button>
        </div>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>
