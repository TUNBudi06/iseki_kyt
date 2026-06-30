<script setup lang="ts">
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import { usePage, useForm, Head } from '@inertiajs/vue3'
import { watch } from 'vue'

const page = usePage<{
  auth?: { user?: { username?: string; role?: string } }
  flash?: { success?: string; error?: string }
}>()

const form = useForm({
  new_password: '',
  new_password_confirmation: '',
})

// Watch for flash messages
watch(() => page.props.flash?.success, (val) => {
  if (val) toast.success(val)
})
watch(() => page.props.flash?.error, (val) => {
  if (val) toast.error(val)
})

function handleSubmit(e: Event) {
  e.preventDefault()
  form.post('/admin/settings/change-password', {
    onSuccess: () => {
      toast.success('Password changed successfully!')
      form.reset()
    },
    onError: (errors) => {
      const firstError = Object.values(errors)[0]
      toast.error(firstError || 'Failed to change password')
    },
  })
}

function handleCancel() {
  form.reset()
}
</script>

<template>
  <Head>
    <title>Settings - Admin Panel</title>
    <meta name="description" content="Admin settings page for managing account" />
  </Head>

  <AdminLayout>
    <div class="space-y-4 md:space-y-6 px-2 sm:px-0">
      <!-- Page Header -->
      <div class="bg-linear-to-r from-pink-500 to-pink-600 rounded-lg p-6 md:p-8 text-white">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p class="text-pink-100 text-sm md:text-base">
          Manage your account settings and preferences
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Change Password Card -->
        <div class="lg:col-span-2">
          <Card class="border-2 border-pink-200">
            <CardHeader class="bg-linear-to-r from-pink-50 to-blue-50 p-4 md:p-6">
              <CardTitle class="text-xl sm:text-2xl font-bold text-pink-600">
                Change Password
              </CardTitle>
              <CardDescription class="text-sm md:text-base mt-1">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent class="p-4 md:p-6">
              <form @submit="handleSubmit">
                <div class="grid gap-6">
                  <!-- New Password -->
                  <div class="grid gap-2">
                    <Label for="new_password" class="text-base font-semibold">
                      New Password
                    </Label>
                    <p class="text-sm text-muted-foreground">
                      Password must be at least 8 characters long.
                    </p>
                    <Input
                      id="new_password"
                      type="password"
                      v-model="form.new_password"
                      placeholder="Enter your new password"
                      :disabled="form.processing"
                      class="h-11 text-base"
                    />
                    <p v-if="form.errors.new_password" class="text-sm text-red-500">{{ form.errors.new_password }}</p>
                  </div>

                  <!-- Confirm New Password -->
                  <div class="grid gap-2">
                    <Label for="new_password_confirmation" class="text-base font-semibold">
                      Confirm New Password
                    </Label>
                    <p class="text-sm text-muted-foreground">
                      Re-enter your new password to confirm.
                    </p>
                    <Input
                      id="new_password_confirmation"
                      type="password"
                      v-model="form.new_password_confirmation"
                      placeholder="Confirm your new password"
                      :disabled="form.processing"
                      class="h-11 text-base"
                    />
                    <p v-if="form.errors.new_password_confirmation" class="text-sm text-red-500">{{ form.errors.new_password_confirmation }}</p>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    @click="handleCancel"
                    :disabled="form.processing"
                    class="h-11 text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    :disabled="form.processing"
                    class="bg-pink-600 hover:bg-pink-700 text-white h-11 text-base font-semibold"
                  >
                    <svg v-if="form.processing" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    {{ form.processing ? 'Changing...' : 'Change Password' }}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Account Information Card -->
        <div class="lg:col-span-1">
          <Card class="border-2 border-gray-200 h-full">
            <CardHeader class="bg-gray-50 p-4 md:p-6">
              <CardTitle class="text-lg sm:text-xl font-bold text-gray-800">
                Account Information
              </CardTitle>
              <CardDescription class="text-sm">
                Your current account details
              </CardDescription>
            </CardHeader>
            <CardContent class="p-4 md:p-6">
              <div class="space-y-4">
                <div class="flex flex-col gap-1 py-3 border-b">
                  <span class="text-sm font-semibold text-gray-600">Username</span>
                  <span class="text-base text-gray-900 font-medium">{{ page.props.auth?.user?.username || '-' }}</span>
                </div>
                <div class="flex flex-col gap-1 py-3 border-b">
                  <span class="text-sm font-semibold text-gray-600">Role</span>
                  <span class="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-pink-100 text-pink-800">
                    {{ page.props.auth?.user?.role || '-' }}
                  </span>
                </div>
                <div class="flex flex-col gap-1 py-3">
                  <span class="text-sm font-semibold text-gray-600">Status</span>
                  <span class="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
