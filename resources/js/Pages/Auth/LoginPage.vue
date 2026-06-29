<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, Link } from '@inertiajs/vue3'
import { login } from '$routes'
import { route } from '@tunbudi06/inertia-route-helper'
import LoginLayout from '@/Layouts/LoginLayout.vue'
import { ref } from 'vue'

const form = useForm({
  username: '',
  password: '',
})

const errors = form.errors

function onsubmit(e) {
  e.preventDefault()
  form.submit('post', route(login()).url, {
    onSuccess: (res) => {
      console.log('Login successful', res)
    },
  })
}
</script>

<template>
  <LoginLayout>
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Login</CardTitle>
        <CardDescription>Enter your username below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onsubmit">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="username">Username</Label>
              <Input id="username" v-model="form.username" type="text" placeholder="johndoe" required />
              <p v-if="errors.username" class="text-sm text-red-500">{{ errors.username }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input id="password" v-model="form.password" type="password" required />
              <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            </div>
            <Button type="submit" class="w-full" :disabled="form.processing">
              {{ form.processing ? 'Logging in...' : 'Login' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </LoginLayout>
</template>
