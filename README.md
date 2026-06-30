# Iseki KYT - Kiken Yochi Training Management

A web application for managing **Kiken Yochi Training (KYT)** — a workplace safety hazard prediction training system. Built with Laravel, Inertia.js, Vue 3, and Tailwind CSS.

## Features

### Core
- **Role-based dashboards** — Admin and Leader panels with tailored views
- **KYT Submission workflow** — Create, edit, review, and track weekly KYT reports
- **Penanganan (Treatment) tracking** — Document hazard treatments with images
- **Monthly filtering** — Navigate months with prev/next buttons or dropdown selector

### Canvas Editor
- **Fabric.js-powered image editor** — Draw highlights, circles, crop, undo/redo
- **Reusable component** — Shared `CanvasEditor.vue` across create/edit/treatment pages
- **Keyboard shortcuts** — Ctrl+Z (undo), Ctrl+Y (redo), Delete (remove object)

### Export
- **PowerPoint export** — Auto-generates `.pptx` with KYT slides per team
- **Image export** — Download KYT preview as PNG (filename uses KYT title)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 12 (PHP 8.x) |
| **Frontend** | Vue 3 + TypeScript 6 |
| **Rendering** | Inertia.js v3 (client) + Inertia Laravel v2 (server) |
| **Styling** | Tailwind CSS v4 + shadcn-vue + Reka UI |
| **Canvas** | Fabric.js |
| **Build** | Vite 7 + vue-tsc |
| **PPT** | PptxGenJS |
| **Routing** | Wayfinder (auto-generated route helpers) |

## Setup

```bash
# Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Frontend
npm install
npm run build

# Dev server
npm run dev
```

**Important:** Add to `.env`:
```
INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE=true
```

## Architecture

### Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── MainController.php      # Login/logout
│   │   ├── AdminController.php     # Admin CRUD
│   │   └── LeaderController.php    # Leader KYT management
│   └── Middleware/
│       ├── LoginCheckMiddleware.php
│       └── hasLoginMiddleware.php
resources/js/
├── Components/
│   ├── CanvasEditor.vue           # Reusable fabric.js editor
│   ├── DropZone.vue               # File upload component
│   ├── KytPreview.vue             # KYT preview renderer
│   └── ui/                        # shadcn-vue components
├── Layouts/
│   ├── AdminLayout.vue            # Admin navigation shell
│   ├── LeaderLayout.vue           # Leader navigation shell
│   ├── DefaultLayout.vue          # Base layout (toaster + tooltips)
│   └── LoginLayout.vue            # Minimal layout for login
├── Pages/
│   ├── Admin/
│   │   ├── Dashboard.vue          # Weekly KYT grid per team
│   │   ├── KYT-list-index.vue     # Tabular KYT listing + PPT download
│   │   ├── Settings.vue           # Password change
│   │   ├── Team-Lists.vue         # Team CRUD
│   │   └── User-Lists.vue         # User CRUD
│   ├── Auth/
│   │   └── LoginPage.vue          # Login form
│   ├── Leader/
│   │   ├── Dashboard.vue          # Team's weekly KYT grid
│   │   ├── KytHistory.vue         # Historical KYT listing
│   │   ├── Settings.vue           # Password change
│   │   ├── editor-KYT-create.vue  # Create KYT with canvas editor
│   │   ├── editor-KYT-edit.vue    # Edit KYT with canvas editor
│   │   └── penanganan/            # Treatment create/edit editors
│   └── kyt_pages.vue              # Public KYT display page
└── lib/
    ├── component/
    │   └── ModalKYTShow.vue       # KYT detail dialog
    └── download/
        ├── KytPptx.ts             # PowerPoint generation
        ├── KytImage.ts            # PNG image export
        └── index.ts               # Export barrel
```

## Login Flow

1. User submits credentials via `LoginPage.vue`
2. `MainController::login()` validates and authenticates
3. Redirects to `admin.home` or `leader.dashboard` based on role
4. Flash message `"Login successful!"` displays as toast on destination page

## Color System

Uses OKLCH color space with pink hue (350°) as primary:

```css
--primary: oklch(0.55 0.18 350);   /* Vibrant pink */
--ring:    oklch(0.55 0.18 350);   /* Focus ring */
--border:  oklch(0.88 0.04 350);   /* Pink-tinted borders */
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
