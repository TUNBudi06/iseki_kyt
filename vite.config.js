// import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';
import {wayfinder} from "@laravel/vite-plugin-wayfinder";

export default defineConfig({
    base: '/iseki_kyt/public/build',
    build: {
        rollupOptions: {
            output: {
                manualChunks:{
                    'svelte-vendor': ['svelte', 'svelte/animate', 'svelte/easing', 'svelte/motion', 'svelte/store', 'svelte/transition'],
                    'icons-vendor': ['@lucide/svelte'],
                },
                chunkFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'svelte-vendor') {
                        return 'vendor/svelte-vendor.[hash].js';
                    }
                    if (chunkInfo.name === 'icons-vendor') {
                        return 'vendor/icons-vendor.[hash].js';
                    }
                    return 'assets/[name].[hash].js';
                }
            }
        }
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        wayfinder({
            command: 'php artisan wayfinder:generate',
            routes: true,
            actions: false,
            // patterns
        }),
        tailwindcss(),
        svelte({
            compilerOptions: {
                dev: process.env.NODE_ENV !== 'production',
            },
        }),
    ],
    resolve: {
        alias: {
            '$': path.resolve(__dirname, './resources/js'),
            '$shadcn': path.resolve(__dirname, './resources/js/shadcn'),
            '$routes': path.resolve(__dirname, './resources/js/routes')
        },
    },
});
