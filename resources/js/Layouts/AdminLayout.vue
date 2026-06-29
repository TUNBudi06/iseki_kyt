<script setup lang="ts">
import DefaultLayout from '@/Layouts/DefaultLayout.vue'
import { usePage, router, Link } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { home as adminHome } from '$routes/admin'
import { settings as SettingsRoute } from '$routes/admin'
import { list as kytList } from '$routes/admin/kyt'
import { logout as webLogout } from '$routes'
import { list as userList } from '$routes/admin/user'
import { list as teamList } from '$routes/admin/team'
import { routeUrl, isCurrentRoute } from '@tunbudi06/inertia-route-helper'
import { ref } from 'vue'

const page = usePage()
const mobileMenuOpen = ref(false)

const navItems = [
  { name: 'Dashboard', href: routeUrl(adminHome()), icon: '📊' },
  { name: 'User', href: routeUrl(userList()), icon: '👤' },
  { name: 'Team', href: routeUrl(teamList()), icon: '👥' },
  { name: 'List KYT', href: routeUrl(kytList()), icon: '📋' },
  { name: 'Settings', href: routeUrl(SettingsRoute()), icon: '⚙️' },
]

function handleLogout() {
  router.post(routeUrl(webLogout()))
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <DefaultLayout>
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-6">
            <Link :href="routeUrl(adminHome())" class="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
              <span class="inline-block">Iseki KYT</span>
            </Link>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1">
              <Link
                v-for="item in navItems"
                :key="item.name"
                :href="item.href"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isCurrentRoute(item.href, true)
                    ? 'bg-pink-500 text-white'
                    : 'text-foreground hover:bg-pink-100 hover:text-pink-600'
                ]"
              >
                <span class="mr-2">{{ item.icon }}</span>
                {{ item.name }}
              </Link>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- User Menu -->
            <div class="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                      {{ page.props.auth?.user?.username?.charAt(0) || 'U' }}
                    </div>
                    <span class="text-sm font-medium">{{ page.props.auth?.user?.username || 'User' }}</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-48" align="end">
                  <DropdownMenuLabel>
                    <div class="flex flex-col space-y-1">
                      <p class="text-sm font-medium leading-none">{{ page.props.auth?.user?.username || 'User' }}</p>
                      <p class="text-xs leading-none text-muted-foreground">{{ page.props.auth?.user?.role || 'Admin' }}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="cursor-pointer" @click="handleLogout">
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <!-- Mobile menu button -->
            <Button
              variant="ghost"
              class="md:hidden"
              @click="toggleMobileMenu"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t py-4 space-y-1">
          <!-- Mobile Navigation Links -->
          <Link
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            :class="[
              'block px-4 py-2 rounded-md text-sm font-medium',
              isCurrentRoute(item.href, true)
                ? 'bg-pink-500 text-white'
                : 'text-foreground hover:bg-pink-100 hover:text-pink-600'
            ]"
          >
            <span class="mr-2">{{ item.icon }}</span>
            {{ item.name }}
          </Link>

          <!-- Mobile User Info & Logout -->
          <div class="pt-4 mt-4 border-t">
            <div class="px-4 py-2 text-sm">
              <div class="font-semibold">{{ page.props.auth?.user?.username || 'User' }}</div>
              <div class="text-xs text-gray-500">{{ page.props.auth?.user?.role || 'Admin' }}</div>
            </div>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </DefaultLayout>
</template>
