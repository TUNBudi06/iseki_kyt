<script lang="ts">
    import DefaultLayouts from "$/Layouts/DefaultLayouts.svelte";
    import { page, router,inertia } from "@inertiajs/svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as DropdownMenu from "$shadcn/components/ui/dropdown-menu/index.js";
    import { home as adminHome } from "$/routes/admin";
    import {settings as SettingsRoute} from "$/routes/admin";
    import { list as kytList } from "$/routes/admin/kyt";
    import {logout as webLogout} from "$routes";
    import {list as userList} from "$/routes/admin/user";
    import {list as teamList} from "$/routes/admin/team";
    import {routeUrl, isCurrentRoute} from "@tunbudi06/inertia-route-helper";


    let { children } = $props();
    let mobileMenuOpen = $state(false);

    // Navigation items
    const navItems = [
        { name: 'Dashboard', href: routeUrl(adminHome()), icon: '📊' },
        { name: 'User', href: routeUrl(userList()), icon: '👤' },
        { name: 'Team', href: routeUrl(teamList()), icon: '👥' },
        { name: 'List KYT', href: routeUrl(kytList()), icon: '📋' },
        { name: 'Settings', href: routeUrl(SettingsRoute()), icon: '⚙️' },
    ];

    function handleLogout() {
        router.post(routeUrl(webLogout()));
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<DefaultLayouts>
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <!-- Logo & Brand -->
                <div class="flex items-center gap-6">
                    <a use:inertia href={routeUrl(adminHome())} class="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                        <span class="inline-block">Iseki KYT</span>
                    </a>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center gap-1">
                        {#each navItems as item}
                            <a
                                use:inertia
                                href={item.href}
                                class="px-4 py-2 rounded-md text-sm font-medium transition-colors {isCurrentRoute(item.href, true)
                                    ? 'bg-pink-500 text-white'
                                    : 'text-foreground hover:bg-pink-100 hover:text-pink-600'}"
                            >
                                <span class="mr-2">{item.icon}</span>
                                {item.name}
                            </a>
                        {/each}
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <!-- User Menu -->
                    <div class="hidden md:block">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button variant="ghost" class="flex items-center gap-2">
                                    <div class="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                                        {$page.props.auth?.user?.username?.charAt(0) || 'U'}
                                    </div>
                                    <span class="text-sm font-medium">{$page.props.auth?.user?.username || 'User'}</span>
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content class="w-48" align="end">
                                <DropdownMenu.Label>
                                    <div class="flex flex-col space-y-1">
                                        <p class="text-sm font-medium leading-none">{$page.props.auth?.user?.username || 'User'}</p>
                                        <p class="text-xs leading-none text-muted-foreground">{$page.props.auth?.user?.role || 'Admin'}</p>
                                    </div>
                                </DropdownMenu.Label>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item class="cursor-pointer" onclick={handleLogout}>
                                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>

                    <!-- Mobile menu button -->
                    <Button
                        variant="ghost"
                        class="md:hidden"
                        onclick={toggleMobileMenu}
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
                            use:inertia
                            href={item.href}
                            class="block px-4 py-2 rounded-md text-sm font-medium {isCurrentRoute(item.href, true)
                                ? 'bg-pink-500 text-white'
                                : 'text-foreground hover:bg-pink-100 hover:text-pink-600'}"
                        >
                            <span class="mr-2">{item.icon}</span>
                            {item.name}
                        </a>
                    {/each}

                    <!-- Mobile User Info & Logout -->
                    <div class="pt-4 mt-4 border-t">
                        <div class="px-4 py-2 text-sm">
                            <div class="font-semibold">{$page.props.auth?.user?.username || 'User'}</div>
                            <div class="text-xs text-gray-500">{$page.props.auth?.user?.role || 'Admin'}</div>
                        </div>
                        <button
                            onclick={handleLogout}
                            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
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
