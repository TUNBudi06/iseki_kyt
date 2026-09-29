import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';
import {wayfinder} from "@laravel/vite-plugin-wayfinder";
import { webfontDownload } from 'vite-plugin-webfont-dl';

export default defineConfig({
    base: '/iseki_kyt/public/build',
    build: {
        rollupOptions: {
            output: {
                manualChunks:{
                    'vendor-vue': ['vue'],
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
        vue(),
        tailwindcss(),
        webfontDownload(['https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap']),
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
});
