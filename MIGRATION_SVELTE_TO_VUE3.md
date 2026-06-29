# Migration Plan: Svelte 5 → Vue 3 (JS)

> **Status:** PLANNING ONLY — Do not implement yet.  
> **Date:** 2026-06-29  
> **Stack:** Laravel 11 + Inertia.js 2.x + TailwindCSS 4 + shadcn

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Dependency Mapping](#2-dependency-mapping)
3. [Architecture Changes](#3-architecture-changes)
4. [Svelte 5 → Vue 3 Concept Mapping](#4-svelte-5--vue-3-concept-mapping)
5. [File-by-File Migration Inventory](#5-file-by-file-migration-inventory)
6. [shadcn-svelte → shadcn-vue Component Migration](#6-shadcn-svelte--shadcn-vue-component-migration)
7. [Toolchain / Config Changes](#7-toolchain--config-changes)
8. [Step-by-Step Execution Order](#8-step-by-step-execution-order)
9. [Risk Register & Known Gaps](#9-risk-register--known-gaps)
10. [Verification Checklist](#10-verification-checklist)

---

## 1. Project Overview

| Aspect | Detail |
|---|---|
| **Backend** | Laravel 11 (PHP 8.x) — UNCHANGED |
| **Frontend framework** | Svelte 5 (runes mode) → Vue 3.4+ |
| **SPA bridge** | Inertia.js 2.x |
| **CSS** | TailwindCSS 4 with `@tailwindcss/vite` |
| **UI kit** | shadcn-svelte → shadcn-vue |
| **Build tool** | Vite 7 |
| **Package manager** | npm (has `package-lock.json` + `bun.lock`) |
| **Total files to migrate** | ~130 `.svelte` → `.vue` + ~15 `.ts` shims |

### Page / Route inventory

| Route group | URL prefix | Pages |
|---|---|---|
| Public | `/` | `kyt_pages` |
| Auth | `/login` | `LoginPage` |
| Admin | `/admin/...` | `Dashboard`, `KYT-list-index`, `Settings`, `Team-Lists`, `User-Lists` |
| Leader | `/leader/...` | `Dashboard`, `KytHistory`, `Settings`, `editor-KYT-create`, `editor-KYT-edit`, `penanganan-create`, `penanganan-edit` |

### Layout inventory

| Layout | Used by |
|---|---|
| `DefaultLayouts` (root shell: Toaster + Tooltip.Provider) | All layouts |
| `AdminLayout` | All admin pages |
| `LeaderLayout` | All leader pages |
| `LoginLayouts` | Login page |

---

## 2. Dependency Mapping

### 2.1 Framework-agnostic packages (KEEP — no change)

| Package | Role |
|---|---|
| `axios` | HTTP client |
| `dayjs` | Date formatting |
| `fabric` | Canvas image editor |
| `html-to-image` | DOM → image (generatePreviewThumbnail) |
| `pptxgenjs` | PowerPoint generation |
| `clsx` | Class merging utility |
| `tailwind-merge` | Tailwind class dedup |
| `tailwind-variants` | Variant-driven class composition |
| `tw-animate-css` | TailwindCSS animation plugin |
| `@internationalized/date` | Date handling (bits-ui dependency) |
| `@tunbudi06/inertia-route-helper` | Type-safe Laravel route helpers for Inertia |
| `@laravel/vite-plugin-wayfinder` | Auto-generates route definitions |
| `laravel-vite-plugin` | Laravel Vite integration |

### 2.2 Svelte-specific packages → Vue equivalents

| Svelte Package | Vue Replacement | Notes & Verification |
|---|---|---|
| `svelte` ^5.49.1 | `vue` ^3.4 (latest 3.5.x) | Core framework |
| `@sveltejs/vite-plugin-svelte` | `@vitejs/plugin-vue` | Vite plugin |
| `@inertiajs/svelte` ^2.3.13 | `@inertiajs/vue3` ^2.x | Official Inertia Vue adapter |
| `bits-ui` ^2.15.5 | `reka-ui` ^1.x (formerly radix-vue) | Headless UI primitives. **shadcn-vue depends on reka-ui.** |
| `@lucide/svelte` | `lucide-vue-next` | Icon library, same icon set |
| `svelte-sonner` ^1.0.7 | `vue-sonner` ^1.x | Toast notifications |
| `mode-watcher` ^1.1.0 | `@vueuse/core` → `useDark()` / `useColorMode()` | Dark mode toggle |
| `svelte-dropzone-runes` | Manual implementation using native drag-and-drop + `<input type="file">`, or `vue3-dropzone` / `vue-filepond` | File upload dropzone. See §9.1 |
| `@vincjo/datatables` ^2.8.0 | `@tanstack/vue-table` + shadcn-vue Table | Headless table with sorting/filtering/pagination. See §9.2 |
| `@tsconfig/svelte` | `@vue/tsconfig` | TS config base |
| `@tailwindcss/language-server` | Same | Unchanged |
| `tailwindcss-debug-screens` | Same | Unchanged |
| `concurrently` | Same | Dev utility |

### 2.3 Removed packages (Svelte-only, no Vue need)

| Package | Reason |
|---|---|
| `svelte` | Replaced by `vue` |
| `@sveltejs/vite-plugin-svelte` | Replaced by `@vitejs/plugin-vue` |
| `@inertiajs/svelte` | Replaced by `@inertiajs/vue3` |
| `bits-ui` | Replaced by `reka-ui` |
| `@lucide/svelte` | Replaced by `lucide-vue-next` |
| `svelte-sonner` | Replaced by `vue-sonner` |
| `mode-watcher` | Replaced by `@vueuse/core` |
| `svelte-dropzone-runes` | Manual reimplementation |
| `@vincjo/datatables` | Replaced by `@tanstack/vue-table` |
| `@tsconfig/svelte` | Replaced by `@vue/tsconfig` |

### 2.4 New packages to install

```bash
npm install vue@latest
npm install -D @vitejs/plugin-vue
npm install @inertiajs/vue3
npm install reka-ui
npm install lucide-vue-next
npm install vue-sonner
npm install @vueuse/core
npm install @tanstack/vue-table
npm install -D @vue/tsconfig
```

---

## 3. Architecture Changes

### 3.1 Entry point

| Current (`app.ts`) | Target (`app.js`) |
|---|---|
| `createInertiaApp` from `@inertiajs/svelte` | `createInertiaApp` from `@inertiajs/vue3` |
| `import.meta.glob('./Pages/**/*.svelte')` | `import.meta.glob('./Pages/**/*.vue')` |
| `hydrate` / `mount` from `svelte` | `createSSRApp` / `createApp` from `vue` + `h` render function |
| `initRouteHelper(props)` utility | `initRouteHelper(props)` — **same utility** |

```js
// New app.js target structure
import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'
import './bootstrap'
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.vue')
    return pages[`./Pages/${name}.vue`]()
  },
  setup({ el, App, props, plugin }) {
    initRouteHelper(props)
    const app = createApp({ render: () => h(App, props) })
    app.use(plugin)
    app.mount(el)
  },
})
```

### 3.2 Blade entry point

`resources/views/app.blade.php` — **NO CHANGE.**  
The `@vite(['resources/js/app.ts'])` directive stays; only the JS entry file changes internally.  
Rename `app.ts` → `app.js` (or keep `.ts` if staying in TypeScript).

### 3.3 Route system

Wayfinder auto-generates route definitions as TypeScript files under `resources/js/routes/`.  
**These are framework-agnostic** — they export plain objects with `.url()` and `.definition`. No change needed.

### 3.4 Alias resolution

All `$`, `$shadcn`, `$routes`, `$lib` path aliases remain identical in `vite.config.js` and `tsconfig.json`. No change needed.

### 3.5 Layout system

| Svelte pattern | Vue 3 pattern |
|---|---|
| `<AdminLayout>` wrapping page with `{@render children?.()}` | `<AdminLayout>` wrapping page with `<slot />` (Inertia persistent layouts) |
| Or Inertia persistent layouts via `layout` property on pages | Same concept; set `layout` in page component's `<script setup>` |

**Decision:** Use **Inertia persistent layouts** (the idiomatic approach for Inertia Vue):

```js
// In page component (e.g., Dashboard.vue)
<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue'
defineOptions({ layout: AdminLayout })
</script>
```

Or use `app.js` resolve callback:

```js
resolve: (name) => {
  const pages = import.meta.glob('./Pages/**/*.vue')
  const page = await pages[`./Pages/${name}.vue`]()
  page.default.layout = page.default.layout || DefaultLayout
  return page
}
```

---

## 4. Svelte 5 → Vue 3 Concept Mapping

### 4.1 Reactivity

| Svelte 5 | Vue 3 (Composition API) |
|---|---|
| `let x = $state(initial)` | `const x = ref(initial)` ← use `.value` |
| `let x = $derived(expr)` | `const x = computed(() => expr)` |
| `$effect(() => { ... })` | `watchEffect(() => { ... })` or `watch(source, callback)` |
| `$effect(() => { return () => cleanup })` | `watchEffect((onCleanup) => { onCleanup(() => { ... }) })`  or `onUnmounted` |
| `$props()` | `defineProps()` |
| `let { prop = default } = $props()` | `const props = defineProps({ prop: { type: X, default: Y } })` |
| `$bindable()` (two-way prop) | `const model = defineModel()` (Vue 3.4+) |
| `$inspect(var)` | `watch(var, (v) => console.log(v), { deep: true })` |

### 4.2 Templating

| Svelte 5 | Vue 3 |
|---|---|
| `{#if cond}...{:else}...{/if}` | `<template v-if="cond">...</template><template v-else>...</template>` |
| `{#each items as item (key)}...{/each}` | `<div v-for="item in items" :key="key">...</div>` |
| `{#snippet name(params)}...{/snippet}` | `<template #name="params">...</template>` (named slot) |
| `{@render name()}` | Default slot rendering: `<slot />` |
| `{@render children?.()}` | `<slot />` (children are passed via default slot) |
| `{@html raw}` | `<span v-html="raw"></span>` |
| `{@const x = expr}` | Use computed in `<script setup>`; no inline equivalent |
| `{@debug expr}` | `{{ expr }}` in template (for debugging) |
| `{variable}` (text interpolation) | `{{ variable }}` |
| `{handler}` (event) | `@event="handler"` |
| `onclick={handler}` | `@click="handler"` |
| `class={expr}` | `:class="expr"` |
| `style="prop: {val}"` | `:style="{ prop: val }"` |

### 4.3 Directives / Special attributes

| Svelte 5 | Vue 3 |
|---|---|
| `bind:value={var}` | `v-model="var"` |
| `bind:this={el}` | `ref="elRef"` → access via `elRef.value` |
| `use:inertia` (action) | Inertia `<Link>` component |
| `use:InertiaLink` (action) | Inertia `<Link>` component |
| `on:click|preventDefault` | `@click.prevent` |
| `svelte:head` block | `<Head>` component from `@inertiajs/vue3` |
| `svelte:window onkeydown={...}` | `@keydown` on root div or `onMounted` + `window.addEventListener` |
| `transition:` / `in:` / `out:` | `<Transition>` / `<TransitionGroup>` components |

### 4.4 Component lifecycle

| Svelte 5 | Vue 3 |
|---|---|
| `onMount(fn)` | `onMounted(fn)` |
| `onDestroy(fn)` | `onUnmounted(fn)` |
| Return fn from `onMount` for cleanup | `onMounted(() => { ... ; onUnmounted(() => cleanup) })` |
| `beforeUpdate(fn)` | `onBeforeUpdate(fn)` |
| `afterUpdate(fn)` | `onUpdated(fn)` |
| `tick()` | `nextTick()` |

### 4.5 Inertia API differences

| Svelte (`@inertiajs/svelte`) | Vue (`@inertiajs/vue3`) |
|---|---|
| `import { page } from '@inertiajs/svelte'` | `import { usePage } from '@inertiajs/vue3'` → `const page = usePage()` |
| `$page.props.auth.user` | `page.props.auth.user` (no `$` prefix) |
| `import { router } from '@inertiajs/svelte'` | `import { router } from '@inertiajs/vue3'` — **same API** |
| `import { useForm } from '@inertiajs/svelte'` | `import { useForm } from '@inertiajs/vue3'` — **same API** |
| `$form.username` | `form.username` (no `$` prefix) |
| `$form.processing` | `form.processing` |
| `$form.errors.xxx` | `form.errors.xxx` |
| `$form.submit(method, url)` | `form.submit(method, url)` or `form.post(url)`, `form.put(url)`, `form.delete(url)` |
| `import { Link } from '@inertiajs/svelte'` | `import { Link } from '@inertiajs/vue3'` — **same component** |
| `<a use:inertia href={url}>` | `<Link :href="url">` (proper component) |

### 4.6 shadcn-svelte → shadcn-vue component API differences

**Critical:** shadcn-vue components have slightly different APIs from shadcn-svelte.  
**Do NOT assume identical prop names or slot behaviors.** Every component must be checked against the [shadcn-vue docs](https://www.shadcn-vue.com/).

Key differences observed:
- shadcn-svelte uses `bind:open={var}` for Dialog; Vue uses `v-model:open="var"`
- shadcn-svelte uses `onclick={handler}` on Button; Vue uses `@click="handler"`
- shadcn-svelte Field components use `bind:value`; Vue uses `v-model`
- Combobox: shadcn-svelte has `items` + `bind:value`; shadcn-vue has different slot API
- Select: shadcn-svelte `Select.Item {...item}` spread; shadcn-vue uses explicit `<SelectItem value="..." />`

---

## 5. File-by-File Migration Inventory

### 5.1 Root / Entry

| Current File | Target File | Key Changes |
|---|---|---|
| `resources/js/app.ts` | `resources/js/app.js` | Replace Svelte Inertia bootstrap with Vue 3 Inertia bootstrap (see §3.1) |
| `resources/js/bootstrap.js` | `resources/js/bootstrap.js` | **NO CHANGE** (axios setup, framework-agnostic) |
| `resources/css/app.css` | `resources/css/app.css` | **NO CHANGE** (TailwindCSS 4, unchanged) |
| `resources/views/app.blade.php` | `resources/views/app.blade.php` | **NO CHANGE** |
| `svelte.config.ts` | **DELETE** | Not needed for Vue |
| `components.json` | Replace | Update for shadcn-vue config |
| `tsconfig.json` | `tsconfig.json` | Change `@tsconfig/svelte` → `@vue/tsconfig`; change `types: ["svelte", ...]` → remove `svelte`; update `include` glob: `*.svelte` → `*.vue` |
| `vite.config.js` | `vite.config.js` | Replace `@sveltejs/vite-plugin-svelte` → `@vitejs/plugin-vue`; update `vendor-svelte` manualChunk → `vendor-vue`; update `input` entry extension if renaming |

### 5.2 Layouts (4 files)

| Svelte File | Vue File | Migration Notes |
|---|---|---|
| `Layouts/DefaultLayouts.svelte` | `Layouts/DefaultLayout.vue` | Root layout: Toaster → `<Toaster ... />`, Tooltip.Provider → `<TooltipProvider>`, slots → `<slot />` |
| `Layouts/AdminLayout.svelte` | `Layouts/AdminLayout.vue` | Navbar + dropdown + mobile menu. Replace `$state`, `{#each}`, `{#if}`, `use:inertia` → `<Link>`, `$page.props` → `usePage().props` |
| `Layouts/LeaderLayout.svelte` | `Layouts/LeaderLayout.vue` | Same patterns as AdminLayout |
| `Layouts/LoginLayouts.svelte` | `Layouts/LoginLayout.vue` | Minimal layout; `svelte:head` → `<Head>` from inertia |

### 5.3 Pages — Auth

| Svelte File | Vue File | Complexity |
|---|---|---|
| `Pages/Auth/LoginPage.svelte` | `Pages/Auth/LoginPage.vue` | LOW — Simple form with `useForm`, Card, Input, Button. Replace `bind:value` → `v-model`, `$form` → `form` |

### 5.4 Pages — Admin

| Svelte File | Vue File | Complexity | Key Patterns |
|---|---|---|---|
| `Pages/Admin/Dashboard.svelte` | `Pages/Admin/Dashboard.vue` | HIGH | Snippets → slots, `$derived` → `computed`, `{#each}`, Fabric canvas image cards, dialog with KytPreview component pass |
| `Pages/Admin/KYT-list-index.svelte` | `Pages/Admin/KYT-list-index.vue` | HIGH | `@vincjo/datatables` → `@tanstack/vue-table`, Combobox, ThSort/ThFilter → TanStack column defs, tooltip snippet → `<Tooltip>` component, `$effect` → `watch` for table reactivity |
| `Pages/Admin/Settings.svelte` | `Pages/Admin/Settings.vue` | LOW | Simple form, `useForm`, flash message toast |
| `Pages/Admin/Team-Lists.svelte` | `Pages/Admin/Team-Lists.vue` | MEDIUM | DataTable → TanStack Table, CRUD dialogs, Select component |
| `Pages/Admin/User-Lists.svelte` | `Pages/Admin/User-Lists.vue` | MEDIUM | Same as Team-Lists |

### 5.5 Pages — Leader

| Svelte File | Vue File | Complexity | Key Patterns |
|---|---|---|---|
| `Pages/Leader/Dashboard.svelte` | `Pages/Leader/Dashboard.vue` | HIGH | KYT card grid, stats cards, dialog with KytPreview, Inertia Link |
| `Pages/Leader/KytHistory.svelte` | `Pages/Leader/KytHistory.vue` | HIGH | DataTable → TanStack Table, Month filter Combobox, ModalKYTShow dialog, download functions |
| `Pages/Leader/Settings.svelte` | `Pages/Leader/Settings.vue` | LOW | Same as Admin/Settings |
| `Pages/Leader/editor-KYT-create.svelte` | `Pages/Leader/editor-KYT-create.vue` | VERY HIGH | **Fabric.js canvas** (framework-agnostic, but Svelte lifecycle + `$state` → `ref` + `onMounted`), dropzone, KytPreview, keyboard shortcuts via `svelte:window` |
| `Pages/Leader/editor-KYT-edit.svelte` | `Pages/Leader/editor-KYT-edit.vue` | VERY HIGH | Same as create + preloading existing data + canvas image load |
| `Pages/Leader/penanganan/Penanganan-create.svelte` | `Pages/Leader/penanganan/Penanganan-create.vue` | HIGH | Fabric.js canvas (1200×600), manual preview without KytPreview component, dropzone |
| `Pages/Leader/penanganan/Penanganan-edit.svelte` | `Pages/Leader/penanganan/Penanganan-edit.vue` | HIGH | Same as create + preloading |

### 5.6 Components

| Svelte File | Vue File | Notes |
|---|---|---|
| `Components/KytPreview.svelte` | `Components/KytPreview.vue` | **CRITICAL.** Used by 4+ pages. Template engine — absolute-positioned divs over image. Uses ResizeObserver, `$effect`, `$bindable`, CSS `scale()`. Replace `$props()` → `defineProps()`, `$bindable()` → `defineModel()`, `$effect` → `watchEffect`, `bind:this` → `ref` |

### 5.7 lib/component

| Svelte File | Vue File | Complexity |
|---|---|---|
| `lib/component/CardBodyImg.svelte` | `lib/component/CardBodyImg.vue` | LOW — simple wrapper |
| `lib/component/ModalKYTShow.svelte` | `lib/component/ModalKYTShow.vue` | MEDIUM — dialog, image display, download buttons |

### 5.8 lib/download (TypeScript, framework-agnostic)

| File | Status | Notes |
|---|---|---|
| `lib/download/KytImage.ts` | **KEEP** | Pure TS, uses `assetUrl` (framework-agnostic) |
| `lib/download/KytPptx.ts` | **KEEP** | Pure TS, uses `pptxgenjs` + `assetUrl` |
| `lib/download/index.ts` | **KEEP** | Re-exports |

### 5.9 Routes (auto-generated, framework-agnostic)

| All files under `routes/` | **KEEP ALL** | Auto-generated by `php artisan wayfinder:generate`. No changes needed. |

### 5.10 wayfinder

| File | Status |
|---|---|
| `wayfinder/index.ts` | **KEEP** | Framework-agnostic utility |

### 5.11 shadcn utils

| File | Status |
|---|---|
| `shadcn/utils.ts` | **KEEP** | `cn()` helper, works everywhere. Types referencing `svelte` → update to `vue` |

---

## 6. shadcn-svelte → shadcn-vue Component Migration

shadcn-vue components **must** be freshly installed via the shadcn-vue CLI, **not** ported manually. They have different internal implementations (based on `reka-ui` instead of `bits-ui`).

### 6.1 Components inventory & install commands

```bash
# Use shadcn-vue CLI (npx shadcn-vue@latest add ...)
# or manually copy from https://www.shadcn-vue.com/

npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add dropdown-menu
npx shadcn-vue@latest add input
npx shadcn-vue@latest add label
npx shadcn-vue@latest add select
npx shadcn-vue@latest add combobox        # may need manual install
npx shadcn-vue@latest add table
npx shadcn-vue@latest add badge
npx shadcn-vue@latest add tooltip
npx shadcn-vue@latest add separator
npx shadcn-vue@latest add popover
npx shadcn-vue@latest add progress
npx shadcn-vue@latest add alert-dialog
npx shadcn-vue@latest add navigation-menu
npx shadcn-vue@latest add sonner           # or use vue-sonner directly
```

### 6.2 Component API difference reference

#### Button
- Svelte: `<Button variant="outline" onclick={handler}>`
- Vue: `<Button variant="outline" @click="handler">` — **same props**

#### Card
- Svelte: `<Card.Root>`, `<Card.Header>`, `<Card.Title>`, `<Card.Description>`, `<Card.Content>`, `<Card.Footer>`
- Vue: Same structure via `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

#### Dialog
- Svelte: `bind:open={var}` on `<Dialog.Root>`
- Vue: `v-model:open="var"` on `<Dialog>`

#### DropdownMenu
- Svelte: `<DropdownMenu.Root>`, `<DropdownMenu.Trigger>`, `<DropdownMenu.Content>`, etc.
- Vue: `<DropdownMenu>`, `<DropdownMenuTrigger>`, `<DropdownMenuContent>`, etc. — flat naming

#### Select
- Svelte: `<Select.Root type="single" bind:value={var}>`, `<Select.Item {...item} />`
- Vue: `<Select v-model="var">`, `<SelectItem value="..." />` — explicit value prop

#### Combobox
- Svelte: `items={list}`, `bind:value={var}`, `placeholder="..."` — props-based
- Vue: Slot-based API. Items rendered via `<CommandItem v-for="item in items" :value="item.value">`. May require manual adaptation.

#### Table
- Svelte: `<Table.Root>`, `<Table.Header>`, `<Table.Row>`, `<Table.Head>`, `<Table.Body>`, `<Table.Cell>`, `<Table.Caption>`
- Vue: Same structure but all as flat components: `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableHead>`, `<TableBody>`, `<TableCell>`, `<TableCaption>`

#### Tooltip
- Svelte: `<Tooltip.Root>`, `<Tooltip.Trigger>`, `<Tooltip.Content>`
- Vue: `<TooltipProvider>`, `<Tooltip>`, `<TooltipTrigger>`, `<TooltipContent>`

#### Badge
- Svelte: `<Badge variant="secondary">`
- Vue: `<Badge variant="secondary">` — **same**

#### Field (Form Field)
- Svelte: `<Field.Set>`, `<Field.Group>`, `<Field.Field>`, `<Field.Label>`, `<Field.Description>`, `<Field.Error>`
- Vue: shadcn-vue has `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` — used within `<Form>` + `vee-validate` or can use raw inputs without Form wrapper.

**Decision:** For forms, port the existing approach directly (using Inertia `useForm` + raw `<Label>` + `<Input>` + error display), without shadcn-vue's `Form` component (which requires `vee-validate`). This maintains compatibility with Inertia form handling. Use only `Label` and `Input` shadcn components.

#### Sonner
- Svelte: `<Toaster position="top-right" richColors />` + `import { toast } from 'svelte-sonner'`
- Vue: `<Toaster position="top-right" richColors />` in `DefaultLayout.vue` + `import { toast } from 'vue-sonner'`

### 6.3 Component import style

**Svelte (namespace import):**
```js
import * as Card from "$shadcn/components/ui/card/index.js";
<Card.Root> <Card.Header> ...
```

**Vue (named import):**
```js
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
<Card> <CardHeader> ...
```

Paths change to `@/components/ui/...` (or keep `$shadcn` alias pointing to new location).

---

## 7. Toolchain / Config Changes

### 7.1 `package.json`

```jsonc
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
    // unchanged
  },
  "dependencies": {
    "vue": "^3.5",
    "@inertiajs/vue3": "^2.3",
    "reka-ui": "^1.0",
    "lucide-vue-next": "^0.561",
    "vue-sonner": "^1.0",
    "@vueuse/core": "^10.0",
    "@tanstack/vue-table": "^8.0",
    // KEEP:
    "@tunbudi06/inertia-route-helper": "^2.0",
    "axios": "^1.13",
    "dayjs": "^1.11",
    "fabric": "^7.1",
    "html-to-image": "^1.11",
    "pptxgenjs": "^4.0",
    "clsx": "^2.1",
    "tailwind-merge": "^3.4",
    "tailwind-variants": "^3.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0",
    "@vue/tsconfig": "^0.7",
    "@internationalized/date": "^3.11",
    "@laravel/vite-plugin-wayfinder": "^0.1",
    "laravel-vite-plugin": "^2.1",
    "@tailwindcss/vite": "^4.1",
    "tailwindcss": "^4.1",
    "tw-animate-css": "^1.4",
    "tailwindcss-debug-screens": "^3.0",
    "concurrently": "^9.2",
    "typescript": "^5.9",
    "vite": "^7.3"
  }
}
```

### 7.2 `vite.config.js`

```js
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'
import path from 'path'
import { wayfinder } from '@laravel/vite-plugin-wayfinder'

export default defineConfig({
  base: '/iseki_kyt/public/build',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router'],
          'vendor-icons': ['lucide-vue-next'],
          'vendor-pptx': ['pptxgenjs'],
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.startsWith('vendor')) {
            const name = chunkInfo.name.split('-')[1]
            return 'vendor/' + name + '.[hash].js'
          }
          return 'assets/[name].[hash].js'
        }
      }
    }
  },
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    wayfinder({
      command: 'php artisan wayfinder:generate',
      routes: true,
      actions: false,
    }),
    tailwindcss(),
    vue({
      // Vue-specific options if needed
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
      '$': path.resolve(__dirname, './resources/js'),
      '$shadcn': path.resolve(__dirname, './resources/js/shadcn'),
      '$routes': path.resolve(__dirname, './resources/js/routes'),
      '$lib': path.resolve(__dirname, './resources/js/lib'),
    },
  },
})
```

### 7.3 `tsconfig.json`

```jsonc
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "lib": ["DOM", "ES2022"],
    "types": ["vite/client"],
    "allowJs": true,
    "checkJs": false,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["resources/js/*"],
      "$/*": ["resources/js/*"],
      "$shadcn": ["resources/js/shadcn"],
      "$shadcn/*": ["resources/js/shadcn/*"],
      "$routes": ["resources/js/routes"],
      "$routes/*": ["resources/js/routes/*"],
      "$lib/*": ["resources/js/lib/*"]
    }
  },
  "include": [
    "resources/js/**/*.ts",
    "resources/js/**/*.js",
    "resources/js/**/*.vue",
    "resources/js"
  ],
  "exclude": ["node_modules", "public", "storage"]
}
```

### 7.4 `components.json` (shadcn config)

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "default",
  "typescript": true,
  "tailwind": {
    "config": "",
    "css": "resources/css/app.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "composables": "@/composables"
  },
  "iconLibrary": "lucide"
}
```

### 7.5 Remove / cleanup

- **Delete** `svelte.config.ts`
- **Delete** `resources/js/shadcn/components/ui/**/*.svelte` (all 70+ files) after components are re-created as `.vue`
- **Delete** `resources/js/.svelte` files one at a time after each `.vue` is verified
- **Remove** `node_modules` and reinstall clean

---

## 8. Step-by-Step Execution Order

### Phase 0: Setup (parallel-safe)

1. **Branch**: `git checkout -b migrate/svelte-to-vue3`
2. **Install new packages**:
   ```bash
   npm uninstall svelte @sveltejs/vite-plugin-svelte @inertiajs/svelte \
     bits-ui @lucide/svelte svelte-sonner mode-watcher \
     svelte-dropzone-runes @vincjo/datatables @tsconfig/svelte \
     @tailwindcss/language-server lucide
   npm install vue @inertiajs/vue3 reka-ui lucide-vue-next \
     vue-sonner @vueuse/core @tanstack/vue-table
   npm install -D @vitejs/plugin-vue @vue/tsconfig
   ```
3. **Update configs**: `vite.config.js`, `tsconfig.json`, `package.json`, `components.json` (using templates from §7)
4. **Verify build fails cleanly** (`npm run build` should fail with module-not-found, not silent errors)

### Phase 1: Scaffold Vue infrastructure

5. Create `resources/js/app.js` with Vue 3 + Inertia bootstrap (template in §3.1)
6. Create `resources/js/Layouts/DefaultLayout.vue` (root layout: Toaster + TooltipProvider + `<slot />`)
7. Install shadcn-vue components fresh (all from §6.1)
8. Configure path aliases in `vite.config.js` — verify with a tiny test
9. **Verify**: `npm run build` produces output (even if blank pages)

### Phase 2: Port layout components

10. `LoginLayout.vue` — simplest, `<Head>` + `<slot />`
11. `AdminLayout.vue` — navbar, dropdown, mobile menu, `<slot />`
12. `LeaderLayout.vue` — same pattern as AdminLayout
13. **Verify**: Layouts render in browser with dummy content

### Phase 3: Port simple pages

14. `Pages/Auth/LoginPage.vue` — form with useForm
15. `Pages/Admin/Settings.vue` — form with useForm
16. `Pages/Leader/Settings.vue` — identical pattern
17. **Verify**: Login and settings pages work end-to-end

### Phase 4: Port list/table pages (medium complexity)

18. `Pages/Admin/Team-Lists.vue` — Datatable → TanStack Table
19. `Pages/Admin/User-Lists.vue` — same pattern
20. **Verify**: CRUD operations work for teams and users

### Phase 5: Port KYT preview component

21. `Components/KytPreview.vue` — **blocker for many pages**, do this first
22. Test with static props
23. **Verify**: Preview renders at native size and with `scaleToFit`

### Phase 6: Port leader pages

24. `Pages/Leader/KytHistory.vue` — DataTable + Month filter
25. `lib/component/ModalKYTShow.vue` — dialog helper
26. **Verify**: History page shows data, view dialog opens

### Phase 7: Port dashboard pages (high complexity)

27. `Pages/Leader/Dashboard.vue` — card grid, stats, dialog
28. `Pages/Admin/Dashboard.vue` — team cards, KYT image cards, dialog
29. **Verify**: Dashboards show all data, dialogs open correctly

### Phase 8: Port canvas editor pages (very high complexity)

30. `Pages/Leader/editor-KYT-create.vue` — **most complex page**
    - Fabric.js canvas with `ref` + `onMounted`
    - Undo/redo history (works the same — fabric-agnostic)
    - Dropzone replacement (see §9.1)
    - Keyboard shortcuts (replace `svelte:window` → `onKeydown` handler on wrapper div or `useEventListener` from VueUse)
    - `generatePreviewThumbnail` → html-to-image (framework-agnostic — same code)
    - `submitKyt` → Inertia form (same API)
31. `Pages/Leader/editor-KYT-edit.vue` — same + preloading
32. `Pages/Leader/penanganan/Penanganan-create.vue` — canvas editor variant
33. `Pages/Leader/penanganan/Penanganan-edit.vue` — same + preloading
34. **Verify**: Each editor page works fully (upload, annotate, save, preview, submit)

### Phase 9: Port admin KYT list page

35. `Pages/Admin/KYT-list-index.vue` — DataTable → TanStack, PPT download, dialog with KytPreview
36. **Verify**: Full admin KYT list with month filter, view, and PPT download

### Phase 10: Port remaining pages

37. `Pages/kyt_pages.vue` — simple public form page
38. `lib/component/CardBodyImg.vue` — simple wrapper

### Phase 11: Cleanup

39. Delete all `.svelte` files
40. Delete `svelte.config.ts`
41. Run `npm run build` — must succeed
42. Run dev server — full smoke test

---

## 9. Risk Register & Known Gaps

### 9.1 svelte-dropzone-runes → Vue replacement

**Risk: MEDIUM**

The `svelte-dropzone-runes` package provides a `<Dropzone>` component with `onDrop` callback that yields `DropzoneEvent<File>`.

**Solution:** Implement a native Vue dropzone using `<div>` + drag-and-drop API + hidden `<input type="file">`.

```vue
<!-- DropZone.vue — reusable component -->
<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-400 transition-colors"
    :class="{ 'border-pink-500 bg-pink-50': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="openFileDialog"
  >
    <input ref="fileInput" type="file" hidden multiple accept="image/*" @change="onFileSelect" />
    <p class="text-sm text-muted-foreground">
      Drag & drop images here, or click to select
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['drop'])
const fileInput = ref(null)
const isDragging = ref(false)

function openFileDialog() {
  fileInput.value?.click()
}

function onFileSelect(e) {
  const files = Array.from(e.target.files || [])
  if (files.length) emit('drop', { acceptedFiles: files })
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'))
  if (files.length) emit('drop', { acceptedFiles: files })
}
</script>
```

Usage in pages changes from:
```svelte
<Dropzone id="foto-upload" multiple onDrop={handleFilesSelect} />
```
to:
```vue
<DropZone @drop="handleFilesSelect" />
```

The `handleFilesSelect` function signature stays the same (takes `{ acceptedFiles: File[] }`).

### 9.2 @vincjo/datatables → @tanstack/vue-table

**Risk: HIGH** — This is the single largest adaptation effort.

The `@vincjo/datatables` library provides a Svelte-specific reactive table with:
- `TableHandler` class for row management, sorting, filtering, pagination
- `Datatable` wrapper component
- `ThSort`, `ThFilter` components for column headers
- `Pagination`, `RowCount` components
- Built-in search input
- `i18n` configuration

`@tanstack/vue-table` is fundamentally different — it's a headless utility, not a component library. You define columns, data, and get back a `table` instance with helpers.

#### TanStack Table setup pattern

```vue
<script setup>
import { ref, computed, watchEffect } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FlexRender,
} from '@tanstack/vue-table'

const props = defineProps({ data: Array })

// Define columns
const columns = [
  { accessorKey: 'no', header: 'No', enableSorting: false },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'actions', header: 'Actions', enableSorting: false },
]

const data = ref([])
watchEffect(() => { data.value = props.data })

const table = useVueTable({
  get data() { return data.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 10 } },
})
</script>
```

#### Template mapping

| `@vincjo/datatables` | `@tanstack/vue-table` |
|---|---|
| `<ThSort {table} field="name">Name</ThSort>` | `<TableHead @click="table.getColumn('name')?.toggleSorting()">Name {{ sortedIcon }}</TableHead>` |
| `<ThFilter {table} field="name" />` | `<input v-model="table.getColumn('name')?.filterValue" />` — manual filter input |
| `{#each table.rows as row}` | `<TableRow v-for="row in table.getRowModel().rows" :key="row.id">` |
| `{row.name}` | `<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />` or `{{ row.getValue('name') }}` |
| `<Pagination {table} />` | Manual pagination buttons using `table.previousPage()`, `table.nextPage()`, `table.getPageCount()` |
| `<RowCount {table} />` | `{{ table.getFilteredRowModel().rows.length }} of {{ data.length }}` |
| `<Datatable {table} basic>` | Not needed — render table directly |
| `table.setRows(data)` | `data.value = newData` — reactive |

**Migration effort estimate per DataTable page:** ~2-3 hours (Team-Lists, User-Lists, KYT-list-index, KytHistory = ~8-12 hours total).

**Alternative:** Keep using a pure reactive table with manual sorting/filtering/pagination (no library), since these are admin-only pages. For 10-50 rows, this may be simpler. **Decision deferred to implementation — try TanStack first, fall back to manual if too complex.**

### 9.3 Fabric.js canvas lifecycle

**Risk: MEDIUM** — Fabric.js is framework-agnostic but the Svelte 5 `onMount` + `$state` pattern differs from Vue 3 `ref` + `onMounted`.

**Svelte pattern:**
```svelte
<script>
let canvasEl = $state<HTMLCanvasElement>()
let canvas = $state<Canvas>()

onMount(() => {
  canvas = new Canvas(canvasEl, { ... })
  return () => canvas?.dispose()
})
</script>
<canvas bind:this={canvasEl} />
```

**Vue pattern:**
```vue
<template>
  <canvas ref="canvasEl" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasEl = ref(null)
const canvas = ref(null)

onMounted(() => {
  canvas.value = new Canvas(canvasEl.value, { ... })
})

onUnmounted(() => {
  canvas.value?.dispose()
})
</script>
```

**Key difference:** In Vue, `canvasEl.value` is null during `setup()`. Only available in `onMounted`.  
**Impact:** All code that accesses `canvasEl` (DOM queries, ResizeObserver) must run inside `onMounted` or after a `nextTick()`. This is already the pattern used in the Svelte code, so adaptation is straightforward.

### 9.4 Keyboard shortcuts (svelte:window)

**Risk: LOW**

Svelte's `<svelte:window onkeydown={handler} />` becomes:

```vue
<script setup>
import { useEventListener } from '@vueuse/core'
// or manual:
// onMounted(() => window.addEventListener('keydown', handler))
// onUnmounted(() => window.removeEventListener('keydown', handler))

function handler(e) {
  if (!canvas.value) return
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
  if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) { e.preventDefault(); redo() }
  if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.value.getActiveObject()) { e.preventDefault(); removeSelected() }
}

useEventListener(window, 'keydown', handler)
</script>
```

### 9.5 Inertia Link vs `use:inertia`

**Risk: LOW**

Svelte uses `<a use:inertia href={url}>` as an inline directive.  
Vue uses the `<Link :href="url">` component.

Migration:
```diff
- <a use:inertia href={routeUrl(dashboard())}>
+ <Link :href="routeUrl(dashboard())">

- import { inertia as InertiaLink } from '@inertiajs/svelte'
- <a use:InertiaLink href={...}>
+ import { Link } from '@inertiajs/vue3'
+ <Link :href="...">
```

### 9.6 svelte:head → `<Head>` component

**Risk: LOW**

```diff
- <svelte:head>
-   <title>Dashboard - Leader Panel</title>
-   <meta name="description" content="..." />
- </svelte:head>
+ <Head>
+   <title>Dashboard - Leader Panel</title>
+   <meta name="description" content="..." />
+ </Head>
```

Import from `@inertiajs/vue3`.

### 9.7 bind:elementId pattern (KytPreview)

**Risk: MEDIUM**

`KytPreview.svelte` uses `$bindable()` for `elementId`:

```svelte
let { elementId = $bindable() } = $props()
<div bind:this={elementId}>
```

This is two-way binding: the parent passes `bind:elementId={previewContainerEl}` and gets the DOM element back.

In Vue 3.4+:
```vue
<script setup>
const elementId = defineModel('elementId')
</script>
<template>
  <div :ref="(el) => elementId = el">
</template>
```

Parent: `<KytPreview v-model:element-id="previewContainerEl" />`

**Note:** `defineModel` requires Vue 3.4+. The project uses Vue ^3.5, so this is available.

### 9.8 ResizeObserver in KytPreview

**Risk: LOW**

Svelte `$effect` with ResizeObserver:
```js
$effect(() => {
  if (!scaleToFit || !containerEl) return
  const observer = new ResizeObserver((entries) => {
    scale = Math.min(entries[0].contentRect.width / NATIVE_W, 1)
  })
  observer.observe(containerEl)
  return () => observer.disconnect()
})
```

Vue equivalent:
```js
import { watchEffect, ref, onUnmounted } from 'vue'

const containerEl = ref(null)
let observer = null

watchEffect(() => {
  if (!props.scaleToFit || !containerEl.value) return
  observer = new ResizeObserver((entries) => {
    scale.value = Math.min(entries[0].contentRect.width / NATIVE_W, 1)
  })
  observer.observe(containerEl.value)
})

onUnmounted(() => observer?.disconnect())
```

### 9.9 Svelte snippets → Vue slots

**Risk: MEDIUM**

Svelte 5 snippets are the closest equivalent to Vue named slots. Some pages use multiple snippets:

```svelte
{#snippet tooltips(icon, text, className)}...{/snippet}
{#snippet cardImg(kytData, ...)}...{/snippet}
{#snippet header()}...{/snippet}
{#snippet footer()}...{/snippet}
```

These are all **internal** to a single component (not passed from outside). In Vue, the simplest approach is to extract these as **component methods** that return VNodes, or as **sub-components**.

**Recommended approach:** Use `<component :is="...">` + functions, or simply inline them in the template since they're used in predictable places. Inline is simplest:

Instead of defining a `tooltips` snippet and calling `{@render tooltips(...)}` in 3 places, just repeat the `<Tooltip>` markup inline 3 times. For larger snippets like `cardImg`, extract as a separate child component `CardImg.vue`.

### 9.10 bind:open on Dialog

**Risk: LOW**

```diff
Svelte:
- <Dialog.Root bind:open={isDialogOpen}>

Vue:
+ <Dialog v-model:open="isDialogOpen">
```

Note: shadcn-vue `Dialog` uses `v-model:open` for the open state binding.

### 9.11 Flash messages

**Risk: LOW**

Svelte pattern:
```js
$effect(() => {
  if ($page.props.flash?.success) toast.success($page.props.flash.success)
  if ($page.props.flash?.error) toast.error($page.props.flash.error)
})
```

Vue pattern:
```js
import { usePage } from '@inertiajs/vue3'

const page = usePage()

watch(() => page.props.flash?.success, (val) => {
  if (val) toast.success(val)
})
watch(() => page.props.flash?.error, (val) => {
  if (val) toast.error(val)
})
```

### 9.12 mode-watcher → @vueuse/core useDark

**Risk: LOW** — The current codebase defines all CSS variables manually for both light and dark modes and uses the `.dark` class selector. `mode-watcher` is listed as a dev dependency but may not be actively used. If it is used, replace with:

```js
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
```

If `mode-watcher` was never integrated, simply remove it.

---

## 10. Verification Checklist

After all files are migrated, verify every page:

### 10.1 Auth

- [ ] `/login` — Login form renders, validation errors show, successful login redirects

### 10.2 Admin

- [ ] `/admin/home` — Dashboard shows team cards with weekly KYT images
- [ ] `/admin/home` — Clicking KYT card opens dialog with KytPreview
- [ ] `/admin/kyt/list` — KYT table shows data, month filter works
- [ ] `/admin/kyt/list` — "View" button opens dialog with team submissions
- [ ] `/admin/kyt/list` — "PPT" button downloads PowerPoint file
- [ ] `/admin/settings` — Change password form works
- [ ] `/admin/settings` — Account info card shows correct data
- [ ] `/admin/team/list` — Team table with sorting, filtering, search
- [ ] `/admin/team/list` — Add / Edit / Delete team dialogs work
- [ ] `/admin/team/list` — Select PIC dropdown populated from users
- [ ] `/admin/user/list` — User table with sorting, filtering, search
- [ ] `/admin/user/list` — Add / Edit / Delete user dialogs work

### 10.3 Leader

- [ ] `/leader/dashboard` — Welcome section + stats cards
- [ ] `/leader/dashboard` — Weekly KYT cards show images or empty states
- [ ] `/leader/dashboard` — Clicking KYT card opens preview dialog
- [ ] `/leader/dashboard` — "Tambah KYT" link navigates to editor
- [ ] `/leader/dashboard` — "Add Penanganan" / "Edit KYT" buttons work
- [ ] `/leader/kyt` — History table with month filter
- [ ] `/leader/kyt` — View / Edit / Add Penanganan / Download Image / Download PPT / Delete buttons
- [ ] `/leader/kyt/add/{id}` — Canvas editor loads
- [ ] `/leader/kyt/add/{id}` — Dropzone uploads images to canvas
- [ ] `/leader/kyt/add/{id}` — Drawing tools (red/yellow highlight, circle) work
- [ ] `/leader/kyt/add/{id}` — Undo/Redo/Crop work
- [ ] `/leader/kyt/add/{id}` — Save generates preview, Submit posts to server
- [ ] `/leader/kyt/edit/{id}` — Edit loads existing data + canvas
- [ ] `/leader/kyt/edit/{id}` — Save updates existing KYT
- [ ] `/leader/kyt/penanganan/add/{kytListId}` — Penanganan create with KYT preview + canvas
- [ ] `/leader/kyt/penanganan/edit/{id}` — Penanganan edit with existing data
- [ ] `/leader/settings` — Change password + account info

### 10.4 Global

- [ ] Dark mode toggle works (if implemented)
- [ ] Mobile responsive navigation (hamburger menu) works
- [ ] Toasts show on success/error for all operations
- [ ] `npm run build` produces no errors
- [ ] No console errors in browser
- [ ] No missing component warnings

---

## Appendix A: Inertia `useForm` Notes

The `useForm` API is **nearly identical** between Svelte and Vue adapters, with one difference:

| Aspect | Svelte | Vue |
|---|---|---|
| Import | `import { useForm } from '@inertiajs/svelte'` | `import { useForm } from '@inertiajs/vue3'` |
| Access reactive form | `$form.field` | `form.field` (no `$`) |
| `form.reset()` | `$form.reset()` | `form.reset()` |
| `form.processing` | `$form.processing` | `form.processing` |
| `form.errors.field` | `$form.errors.field` | `form.errors.field` |
| `form.submit(method, url)` | `$form.submit(route(...))` | `form.submit(route(...))` |
| `form.post(url)` | `$form.post(url)` | `form.post(url)` |
| `form.put(url)` | `$form.put(url)` | `form.put(url)` |
| `form.delete(url)` | `$form.delete(url)` | `form.delete(url)` |

The `route()` helper from `@tunbudi06/inertia-route-helper` returns a `RouteDefinition` object with `.url` and `.method` — works identically in both frameworks.

---

## Appendix B: Estimated Effort

| Phase | Files | Est. Hours |
|---|---|---|
| Phase 0: Setup | Configs | 2h |
| Phase 1: Scaffold | 2 files | 2h |
| Phase 2: Layouts | 4 files | 4h |
| Phase 3: Simple pages | 3 files | 3h |
| Phase 4: List/table pages | 2 files | 8h (TanStack adaptation) |
| Phase 5: KytPreview | 1 file | 4h |
| Phase 6: Leader history | 2 files | 4h |
| Phase 7: Dashboards | 2 files | 6h |
| Phase 8: Canvas editors | 4 files | 16h |
| Phase 9: Admin KYT list | 1 file | 4h |
| Phase 10: Remaining | 2 files | 2h |
| Phase 11: Cleanup | — | 2h |
| **TOTAL** | **~25 files** | **~57 hours** (~7-8 working days) |

---

## Appendix C: Files NOT to touch

These files should NOT be modified during migration:

- All PHP files (`app/`, `config/`, `routes/`, `database/`, `bootstrap/`)
- `resources/views/app.blade.php` (only if Vue setup works as-is)
- `resources/js/routes/**/*.ts` (auto-generated)
- `resources/js/wayfinder/index.ts`
- `resources/js/lib/download/*.ts`
- `public/**/*`
- `storage/**/*`
- `composer.json`, `composer.lock`
- `package-lock.json` (will be regenerated)
- `.env`, `.env.example`
- `.gitignore`
