# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Backend**: Laravel 12 (PHP 8.2+, requires `ext-calendar`)
- **Frontend**: Vue 3 + TypeScript + Inertia.js v3 + Tailwind CSS v4 + shadcn-vue
- **Canvas**: Fabric.js 7 (used for KYT sketch/annotation editing)
- **Tests**: Pest 3 (PHP only — no JS test runner configured)
- **Build**: Vite 7 + `vue-tsc`, no JS lint or typecheck npm scripts exist (`vue-tsc` must be invoked manually if needed)

> The project was migrated from Svelte 5 to Vue 3. `MIGRATION_SVELTE_TO_VUE3.md` is a historical reference only — no `.svelte` files remain. `.eslintrc`, `.github/copilot-instructions.md`, and the `@source` directive in `resources/css/app.css` still reference Svelte/`.svelte` and are stale; ignore their Svelte-specific guidance.

## Commands

| Action | Command |
|---|---|
| Full setup | `composer setup` |
| Dev servers (PHP + queue + Vite, concurrently) | `composer dev` |
| Build frontend | `npm run build` |
| Run all tests | `composer test` |
| Single test | `php artisan test --compact --filter=testName` |
| Format PHP (only changed files) | `vendor/bin/pint --dirty` |
| Regenerate Wayfinder route/action helpers | `php artisan wayfinder:generate` |

Wayfinder also regenerates automatically during `npm run dev` / `npm run build` via the `@laravel/vite-plugin-wayfinder` Vite plugin (see `vite.config.js`).

## Required `.env` setup

The app is served from the subdirectory `/iseki_kyt/public` (e.g. XAMPP htdocs), not the domain root:

```
INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE=true
SESSION_PATH=/iseki_kyt/public
APP_URL=http://localhost/iseki_kyt/public
```

Vite's `base` is hardcoded to `/iseki_kyt/public/build` in `vite.config.js` — if the project is ever relocated, this and `APP_URL`/`SESSION_PATH` must change together.

DB drivers: `session=mysql`, `cache=database`, `queue=database`.

## Path aliases (TS/JS, defined in `vite.config.js`)

- `@/` or `$/` → `resources/js/`
- `$shadcn/` → `resources/js/shadcn/`
- `$routes/` → `resources/js/routes/` (auto-generated Wayfinder route helpers — do not hand-edit)
- `$lib/` → `resources/js/lib/`

## Architecture

### Roles and routing

There are two roles, `admin` and `leader`, each with its own middleware and route file:

- `routes/web.php` is the entry point. It mounts `/admin` behind `AdminMiddleware` (requiring `routes/admin.php`) and `/leader` behind `hasLoginMiddleware` (requiring `routes/leader.php`). The `/` index route uses `LoginCheckMiddleware` to redirect already-authenticated users to their role's dashboard.
- Inertia pages for each role live under `resources/js/Pages/Admin/` and `resources/js/Pages/Leader/`, with matching layouts in `resources/js/Layouts/` (`AdminLayout.vue`, `LeaderLayout.vue`, plus `DefaultLayout.vue` and `LoginLayout.vue`).
- Global middleware registration happens in `bootstrap/app.php` (Laravel 12 style — there is no `Kernel.php`). Two `web` middlewares are appended globally: `HandleInertiaRequests` and `autoGenerateFridayDateAfterThursdayByBindMiddleware`.

### Shared Inertia props

`HandleInertiaRequests` (`app/Http/Middleware/HandleInertiaRequests.php`) shares `baseUrl` (from `config('app.url')`) and `auth.user` (`id`, uppercased `username`, `role`) on every request.

### KYT domain model

"KYT" (a workplace safety/hazard-prediction exercise) is organized around weekly Friday dates:

- `KytDateList` — the list of upcoming/past Friday dates KYT entries are filed against.
- `KYTList` (table `k_y_t_lists`) — a single KYT entry, belonging to a `TeamKYT` and a `KytDateList`, and has one `KytPenanganan` (a follow-up handling/remediation record with its own photo and result export).
- `TeamKYT` — the team a KYT entry belongs to.
- The **`autoGenerateFridayDateAfterThursdayByBindMiddleware`** global middleware auto-generates `KytDateList` rows for the current and next month once the app gets within 2 days of the last known Friday date, via `App\Helper\KytDateParser`. This is why new Friday slots "just appear" — there's no manual seeding step for them.

### Leader flow

`routes/leader.php` covers the main authoring flow: create/edit/delete KYT entries (`editor-KYT-create.vue`, `editor-KYT-edit.vue`), then submit a "penanganan" (handling) sub-record for a KYT entry (`Penanganan-create.vue`), which itself can be edited later. `KytHistory.vue` lists a leader's past entries.

### Canvas editing and export

- `CanvasEditor.vue` wraps Fabric.js 7 — canvas is initialized in `onMounted` and must be disposed in `onUnmounted` to avoid leaks.
- `DropZone.vue` handles drag-and-drop image upload feeding into the canvas/KYT form.
- `KytPreview.vue` renders a scaled template preview of a KYT record (used both on-screen and as the basis for export).
- `resources/js/lib/download/KytPptx.ts` and `KytImage.ts` export a KYT record to PowerPoint (via `pptxgenjs`) or image (via `html-to-image`) respectively — these consume the same preview markup/layout as `KytPreview.vue`, so layout changes there must be kept in sync with the export renderers.

### Design system

Colors are OKLCH-based with a pink primary (hue 350°), defined as CSS variables in `resources/css/app.css`. UI primitives come from shadcn-vue (installed under `resources/js/Components/ui/`) via `class-variance-authority`/`tailwind-variants`/`reka-ui`.

### Routes/actions from the frontend

Do not construct backend URLs by hand. Import generated helpers from `$routes/` (named routes) or `@/actions/` (invokable-controller helpers), produced by Laravel Wayfinder from the PHP route definitions. Regenerate with `php artisan wayfinder:generate` if a route changed and the generated TS is stale.
