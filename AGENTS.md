# AGENTS.md — iseki_kyt

## Stack
- **Backend**: Laravel 12 (PHP 8.2+, `ext-calendar` required)
- **Frontend**: Vue 3 + TypeScript + Inertia.js v3 + Tailwind CSS v4 + shadcn-vue
- **Canvas**: Fabric.js 7
- **Test**: Pest 3 (PHP), no JS tests
- **Build**: Vite 7 + `vue-tsc`, no JS lint or typecheck commands in scripts

## Commands

| Action | Command |
|---|---|
| Full setup | `composer setup` |
| Dev servers (PHP + queue + Vite) | `composer dev` |
| Build frontend | `npm run build` |
| Run all tests | `composer test` |
| Single test | `php artisan test --compact --filter=testName` |
| Format PHP | `vendor/bin/pint --dirty` |
| Generate routes | `php artisan wayfinder:generate` |

## Required `.env` setup
```
INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE=true
SESSION_PATH=/iseki_kyt/public
APP_URL=http://localhost/iseki_kyt/public
```
App runs from subdirectory `/iseki_kyt/public`. Vite base is `/iseki_kyt/public/build`.

## Path aliases (TS/JS)
- `@/` or `$/` → `resources/js/`
- `$shadcn/` → `resources/js/shadcn/`
- `$routes/` → `resources/js/routes/` (auto-generated Wayfinder route helpers)
- `$lib/` → `resources/js/lib/`

## Architecture
- **Roles**: `admin` and `leader` (middleware-gated routes in `routes/admin.php`, `routes/leader.php`)
- **Middlewares registered in `bootstrap/app.php`**: `HandleInertiaRequests`, `autoGenerateFridayDateAfterThursdayByBind`
- **DB drivers**: session=mysql, cache=database, queue=database
- **Color system**: OKLCH with pink primary (hue 350°), defined as CSS variables in `resources/css/app.css`
- **Shared Inertia props**: `auth.user` (id, username, role), `baseUrl`

## Key components
- `CanvasEditor.vue` — Fabric.js canvas (lifecycle: init in `onMounted`, dispose in `onUnmounted`)
- `DropZone.vue` — drag-and-drop file upload
- `KytPreview.vue` — template engine rendering KYT as scaled preview
- Export: `$lib/download/` (`KytPptx.ts`, `KytImage.ts`)
- ui components via shadcn-vue CLI

## Migration note
Project was migrated from Svelte 5 to Vue 3. `MIGRATION_SVELTE_TO_VUE3.md` is a historical reference. No `.svelte` files remain.

## Stale configs to be aware of
- `.eslintrc` still has Svelte rules (off, inactive)
- `.github/copilot-instructions.md` references Svelte and `@inertiajs/svelte` — outdated
- `resources/css/app.css` `@source` still references `*.svelte` (should be `*.vue`)
