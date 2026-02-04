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
                    'vendor-svelte': ['svelte', 'svelte/animate', 'svelte/easing', 'svelte/motion', 'svelte/store', 'svelte/transition'],
                    'vendor-icons': ['@lucide/svelte'],
                    'vendor-pptx': ['pptxgenjs'],
                },
                chunkFileNames: (chunkInfo) => {
                    if (chunkInfo.name.startsWith('vendor')) {
                        const name = chunkInfo.name.split('-')[1];

                        return 'vendor/'+name+'.[hash].js';
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
            '$routes': path.resolve(__dirname, './resources/js/routes'),
            '$lib': path.resolve(__dirname, './resources/js/lib'),
        },
    },
});
