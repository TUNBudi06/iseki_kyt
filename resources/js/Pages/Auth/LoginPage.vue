<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, usePage, Link } from '@inertiajs/vue3'
import { login } from '$routes'
import { route } from '@tunbudi06/inertia-route-helper'
import LoginLayout from '@/Layouts/LoginLayout.vue'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

const page = usePage<{ flash?: { success?: string; error?: string } }>()

const form = useForm({
  username: '',
  password: '',
})

const errors = form.errors

// Watch for flash messages after redirect
watch(() => page.props.flash?.success, (val) => {
  if (val) toast.success(val)
})
watch(() => page.props.flash?.error, (val) => {
  if (val) toast.error(val)
})

function onsubmit(e:Event) {
  e.preventDefault()
  form.submit('post', route(login()).url)
}
</script>

<template>
  <LoginLayout>
    <div class="w-full max-w-md mx-auto space-y-6">
      <!-- Brand Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-primary">Iseki KYT</h1>
        <p class="text-muted-foreground">Kiken Yochi Training Management</p>
      </div>

      <Card class="border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader class="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
          <CardTitle class="text-2xl text-primary">Login</CardTitle>
          <CardDescription>Enter your username below to login to your account</CardDescription>
        </CardHeader>
        <CardContent class="pt-6">
          <form @submit="onsubmit">
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="username">Username</Label>
                <Input id="username" v-model="form.username" type="text" placeholder="johndoe" required class="focus:ring-primary/50" />
                <p v-if="errors.username" class="text-sm text-destructive">{{ errors.username }}</p>
              </div>
              <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input id="password" v-model="form.password" type="password" required class="focus:ring-primary/50" />
                <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
              </div>
              <Button type="submit" class="w-full" :disabled="form.processing">
                {{ form.processing ? 'Logging in...' : 'Login' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </LoginLayout>
</template>
