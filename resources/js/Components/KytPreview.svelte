<script lang="ts">
    let {
        bgKyt,
        kytDate,
        kytTeam = "",
        kytTitle = "",
        savedImageUrl = "",
        kytPic = "",
        kytPotensi = "",
        kytPenanganan = "",
        elementId = $bindable()
    } = $props();
</script>

<div class="relative mx-auto w-7xl h-180" bind:this={elementId}>
    <!-- Background KYT Image - PPT Size 1280x720 -->
    <img
        src={bgKyt}
        alt="KYT Background"
        class="rounded-lg border border-border object-cover w-full h-full"
    />

    <!-- Team Name Text - Positioned to match PPT layout (offsetX: 750, offsetY: 0, width: 530, height: 10) -->
    {#if kytTeam}
    <div class="absolute left-187.5 top-0 w-132.5 h-2.5 text-center">
        <span
            class="font-bold text-3xl leading-tight text-[#404040]"
            style="text-shadow: 2.5px 2.5px 3px rgba(0, 0, 0, 0.4);"
        >
            {kytTeam}
        </span>
    </div>
    {/if}

    <!-- Title Text Box - Positioned to match PPT layout (offsetX: 50, offsetY: 80, width: 680, height: 50) -->
    {#if kytTitle}
    <div class="absolute left-12.5 top-20 w-170 h-12.5 flex items-center justify-center">
        <span
            class="font-bold text-2xl leading-tight text-center text-black uppercase"
        >
            {kytTitle}
        </span>
    </div>
    {/if}

    <!-- Overlay Saved Image or Placeholder -->
    {#if savedImageUrl}
        <div class="absolute left-12.5 top-33.25 w-170 h-125.5">
            <img
                src={savedImageUrl}
                alt="Hasil editing KYT"
                class="rounded shadow-lg object-contain w-full h-full"
            />
        </div>
    {:else}
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-muted-foreground bg-white/80 p-4 rounded-lg">
                <p class="text-sm font-medium">Belum ada gambar tersimpan</p>
                <p class="text-xs mt-1">Upload dan edit gambar, lalu klik Save</p>
            </div>
        </div>
    {/if}

    <!-- Date Text - Positioned to match PPT layout (offsetX: 780, offsetY: 650) -->
    <div class="absolute right-16.5 bottom-2 w-120 h-15 text-right">
        <span
            class="font-bold text-5xl leading-tight text-[#2F5597]"
            style="text-shadow: 2.5px 2.5px 3px rgba(0, 0, 0, 0.4);"
        >
            {new Date(kytDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })}
        </span>
    </div>

    <!-- PIC Label - Positioned to match PPT layout (offsetX: 800, offsetY: 100) -->
    {#if kytPic}
    <div class="absolute left-200 top-25 w-107.5 h-8.75">
        <span class="font-bold text-3xl leading-tight text-[#FF0000]">
            DISAMPAIKAN OLEH :
        </span>
    </div>
    <!-- PIC Value - Positioned to match PPT layout (offsetX: 800, offsetY: 125) -->
    <div class="absolute left-200 top-32.25 w-107.5 h-10">
        <span class="text-3xl leading-tight text-black">
            {kytPic}
        </span>
    </div>
    {/if}

    <!-- Potensi Bahaya Label - Positioned to match PPT layout (offsetX: 800, offsetY: 180) -->
    {#if kytPotensi}
    <div class="absolute left-200 top-45 w-107.5 h-8.75">
        <span class="font-bold text-3xl leading-tight text-[#FF0000]">
            POTENSI BAHAYA :
        </span>
    </div>
    <!-- Potensi Bahaya Value - Positioned to match PPT layout (offsetX: 800, offsetY: 205) -->
    <div class="absolute left-200 top-53.25 w-107.5 h-39.5 overflow-hidden">
        <p class="text-2xl leading-snug text-black whitespace-pre-wrap wrap-break-word">
            {kytPotensi}
        </p>
    </div>
    {/if}

    <!-- Penanganan Label - Positioned to match PPT layout (offsetX: 800, offsetY: 380) -->
    {#if kytPenanganan }
    <div class="absolute left-200 top-95 w-107.5 h-8.75">
        <span class="font-bold text-3xl leading-tight text-[#FF0000]">
            PENANGANAN :
        </span>
    </div>
    <!-- Penanganan Value - Positioned to match PPT layout (offsetX: 800, offsetY: 405) -->
    <div class="absolute left-200 top-103.25 w-107.5 h-50.5 overflow-hidden">
        <p class="text-2xl leading-snug text-black whitespace-pre-wrap break-words">
            {kytPenanganan}
        </p>
    </div>
    {/if}
</div>
