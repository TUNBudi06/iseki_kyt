<script lang="ts">
    import DefaultLayouts from "$/Layouts/DefaultLayouts.svelte";
    import { page, router, inertia } from "@inertiajs/svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import leader from "$/routes/leader";
    import {logout} from "$routes";
    import {routeUrl,isCurrentRoute} from "@tunbudi06/inertia-route-helper";

    let { children } = $props();
    let mobileMenuOpen = $state(false);
    let userMenuOpen = $state(false);

    const navItems = [
        { name: 'Dashboard', href: routeUrl(leader.dashboard()), icon: '📊' },
        { name: 'KYT', href: routeUrl(leader.kyt()), icon: '📋' },
        { name: 'Settings', href: routeUrl(leader.settings()), icon: '⚙️' },
    ];

    function handleLogout() {
        router.post(routeUrl(logout()));
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
    <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center gap-6">
                    <a use:inertia href={routeUrl(leader.dashboard())} class="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                        <span class="inline-block">Iseki KYT - Leader</span>
                    </a>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center gap-1">
                        {#each navItems as item}
                            <a
                                use:inertia
                                href={item.href}
                                class="px-4 py-2 rounded-md text-sm font-medium transition-colors {isCurrentRoute(item.href,true)
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
                    <div class="relative hidden md:block">
                        <Button
                            variant="ghost"
                            onclick={toggleUserMenu}
                            class="flex items-center gap-2"
                        >
                            <div class="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                                {$page.props.auth?.user?.username?.charAt(0) || 'U'}
                            </div>
                            <span class="text-sm font-medium">{$page.props.auth?.user?.username || 'User'}</span>
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>

                        {#if userMenuOpen}
                            <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div class="py-1">
                                    <div class="px-4 py-2 text-sm text-gray-700 border-b">
                                        <div class="font-semibold">{$page.props.auth?.user?.username || 'User'}</div>
                                        <div class="text-xs text-gray-500">{$page.props.auth?.user?.role || 'Leader'}</div>
                                    </div>
                                    <button
                                        onclick={handleLogout}
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        {/if}
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
                            class="block px-4 py-2 rounded-md text-sm font-medium {isActive(item.href)
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
                            <div class="text-xs text-gray-500">{$page.props.auth?.user?.role || 'Leader'}</div>
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
    <main class="flex-1 container mx-auto px-4 py-6">
        {@render children()}
    </main>
</DefaultLayouts>
