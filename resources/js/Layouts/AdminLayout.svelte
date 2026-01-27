<script lang="ts">
    import DefaultLayouts from "$/Layouts/DefaultLayouts.svelte";
    import { page, router,inertia } from "@inertiajs/svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as Separator from "$shadcn/components/ui/separator/index.js";
    import { home as adminHome } from "$/routes/admin";
    import {route} from "$/lib/route-helper";

    let { children } = $props();
    let mobileMenuOpen = $state(false);
    let userMenuOpen = $state(false);

    // Navigation items
    const navItems = [
        { name: 'Dashboard', href: route(adminHome()).url, icon: '📊' },
        { name: 'Projects', href: '/projects', icon: '📁' },
        { name: 'Team', href: '/team', icon: '👥' },
        { name: 'Reports', href: '/reports', icon: '📈' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
    ];

    function isActive(href: string): boolean {
        return window.location.href.startsWith(href);
    }

    function handleLogout() {
        router.post('/logout');
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function toggleUserMenu() {
        userMenuOpen = !userMenuOpen;
    }
</script>

<DefaultLayouts>
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <!-- Logo & Brand -->
                <div class="flex items-center gap-6">
                    <a use:inertia href={route(adminHome()).url} class="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <span class="text-lg font-bold">IK</span>
                        </div>
                        <span class="hidden sm:inline-block">Iseki KYT</span>
                    </a>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center gap-1">
                        {#each navItems as item}
                            <a
                                use:inertia href={item.href}
                                class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive(item.href)
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
                            >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </a>
                        {/each}
                    </div>
                </div>

                <!-- Right Section: Notifications & User Menu -->
                <div class="flex items-center gap-3">
                    <!-- Notifications Button (Desktop) -->
                    <Button variant="ghost" size="icon" class="hidden md:flex relative">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>

                    <!-- User Dropdown (Desktop) -->
                    <div class="hidden md:block relative">
                        <Button
                            variant="ghost"
                            class="flex items-center gap-2 px-3"
                            onclick={toggleUserMenu}
                        >
                            <div class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                                {($page.props.auth?.user?.username || 'U')[0].toUpperCase()}
                            </div>
                            <div class="text-left">
                                <p class="text-sm font-medium leading-none">
                                    {$page.props.auth?.user?.username || 'User'}
                                </p>
                                <p class="text-xs text-muted-foreground">Admin</p>
                            </div>
                            <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>

                        <!-- Dropdown Menu -->
                        {#if userMenuOpen}
                            <div class="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg">
                                <div class="p-2 space-y-1">
                                    <div class="px-3 py-2 text-sm">
                                        <p class="font-medium">{$page.props.auth?.user?.username || 'User'}</p>
                                        <p class="text-xs text-muted-foreground">admin@iseki.com</p>
                                    </div>
                                    <Separator.Root />
                                    <a use:inertia href="/profile" class="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors">
                                        <span>👤</span>
                                        <span>Profile</span>
                                    </a>
                                    <a use:inertia href="/settings" class="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors">
                                        <span>⚙️</span>
                                        <span>Settings</span>
                                    </a>
                                    <Separator.Root />
                                    <button
                                        onclick={handleLogout}
                                        class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors text-left"
                                    >
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Mobile Menu Button -->
                    <Button
                        variant="ghost"
                        size="icon"
                        class="md:hidden"
                        onclick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {#if mobileMenuOpen}
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            {:else}
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            {/if}
                        </svg>
                    </Button>
                </div>
            </div>

            <!-- Mobile Menu -->
            {#if mobileMenuOpen}
                <div class="md:hidden border-t py-4 space-y-1">
                    <!-- Mobile Navigation Links -->
                    {#each navItems as item}
                        <a
                            use:inertia href={item.href}
                            class="flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors {isActive(item.href)
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
                        >
                            <span class="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </a>
                    {/each}

                    <Separator.Root class="my-3" />

                    <!-- Mobile User Section -->
                    <div class="px-3 py-2">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                                {($page.props.auth?.user?.username || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                                <p class="text-sm font-medium">{$page.props.auth?.user?.username || 'User'}</p>
                                <p class="text-xs text-muted-foreground">admin@iseki.com</p>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <a use:inertia href="/profile" class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                                <span>👤</span>
                                <span>Profile</span>
                            </a>
                            <a use:inertia href="/settings" class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                                <span>⚙️</span>
                                <span>Settings</span>
                            </a>
                            <Button
                                variant="ghost"
                                class="w-full justify-start gap-2"
                                onclick={handleLogout}
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
        {@render children?.()}
    </main>
</DefaultLayouts>
