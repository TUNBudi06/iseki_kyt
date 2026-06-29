<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue'
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head>
    <title>KYT - Kiken Yochi Training</title>
  </Head>

  <DefaultLayout>
    <div class="max-h-[700px] bg-pink-50 p-4 text-blue-900">
      <div class="mx-auto max-w-[1400px]">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div class="text-3xl font-serif font-extrabold tracking-tight text-pink-600">
            KIKEN YOCHI TRAINING (KYT)
          </div>
          <div class="text-2xl font-bold text-blue-600">SUB ASSY — MAIN LINE</div>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[2.3fr_1fr]">
          <div class="relative rounded-[14px] border-[3px] border-blue-700 bg-white p-4">
            <input
              class="mb-3 w-full rounded-xl border-[3px] border-blue-600 bg-pink-200 px-3 py-2 text-lg font-bold text-pink-700 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Tuliskan tema / pekerjaan hari ini..."
            />
            <div
              class="flex h-[520px] items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-white text-blue-500"
            >
              Upload / Tempel Foto Area Kerja
            </div>
          </div>

          <div class="relative rounded-[14px] border-[3px] border-blue-700 bg-blue-50 p-4">
            <div class="mb-7">
              <label class="mb-2 block text-lg font-extrabold text-pink-600">
                DISAMPAIKAN OLEH:
              </label>
              <input
                class="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Nama PIC / Leader..."
              />
            </div>

            <div class="mb-7">
              <label class="mb-2 block text-lg font-extrabold text-pink-600">
                POTENSI BAHAYA:
              </label>
              <textarea
                class="min-h-[90px] max-h-[189px] w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Tuliskan potensi bahaya..."
              ></textarea>
            </div>

            <div class="mb-7">
              <label class="mb-2 block text-lg font-extrabold text-pink-600">
                PENANGANAN:
              </label>
              <textarea
                class="min-h-[90px] max-h-[146px] w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Tuliskan tindakan pencegahan..."
              ></textarea>
            </div>

            <div class="absolute bottom-2 right-2 text-xs text-blue-600">KYT Form</div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
