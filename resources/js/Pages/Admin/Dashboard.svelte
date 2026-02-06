<script lang="ts">
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Dialog from "$shadcn/components/ui/dialog/index.js";
    import { page } from "@inertiajs/svelte";
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import {assetUrl} from "@tunbudi06/inertia-route-helper";
    import {onMount} from "svelte";

    let { weeksInCurrentMonth = [], teams = [], currentYear = 2026, currentMonthName = "January" } = $props();

    // Dialog state for viewing KYT details
    let isDialogOpen = $state(false);
    let selectedKyt = $state(null);

    let dateparams:number = $state(0);

    onMount(() => {
        dateparams = Date.now();
    })

    const weeks = $derived.by(() => {
        // If no data from backend, generate dummy weeks
        if (!weeksInCurrentMonth || weeksInCurrentMonth.length === 0) {
            const currentDate = new Date();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            const monthIndex = monthNames.indexOf(currentMonthName);
            const month = monthIndex >= 0 ? monthIndex : currentDate.getMonth();
            const year = parseInt(currentYear) || currentDate.getFullYear();

            // Generate 4 dummy weeks
            const generatedWeeks = [];
            for (let i = 0; i < 4; i++) {
                const startDay = i * 7 + 1;
                const endDay = Math.min((i + 1) * 7, new Date(year, month + 1, 0).getDate());
                generatedWeeks.push({
                    start: new Date(year, month, startDay),
                    end: new Date(year, month, endDay),
                    week_number: i + 1
                });
            }
            return generatedWeeks;
        }

        // Convert date strings to Date objects
        const generatedWeeks = [];

        for (let i = 0; i < weeksInCurrentMonth.length; i++) {
            const week = weeksInCurrentMonth[i];

            // Parse date_start and date_end strings (format: 'YYYY-MM-DD')
            const startDate = new Date(week.date_start);
            const endDate = new Date(week.date_end);

            generatedWeeks.push({
                id: week.id,
                start: startDate,
                end: endDate,
                week_number: week.week_number || (i + 1)
            });
        }

        return generatedWeeks;
    });


    // Calculate card width based on number of weeks (4 or 5) - responsive
    const cardWidthClass = $derived(weeks.length === 4
        ? "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(25%-0.75rem)]"  // Mobile: full, Tablet: 2 cols, Desktop: 4 cols
        : "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(20%-0.6rem)]");  // Mobile: full, Tablet: 2 cols, Desktop: 5 cols

    const formatWeekRange = (start, end) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
    };

    const getMonthName = (date) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[date.getMonth()];
    };

    // Check if week belongs to next month
    const isNextMonth = (week, currentMonthName) => {
        const weekMonth = getMonthName(week.start);
        return weekMonth !== currentMonthName;
    };

    // Function to open KYT dialog
    function openKytDialog(kytData, weekNumber, weekStart, weekEnd, teamName) {
        selectedKyt = {
            ...kytData,
            weekNumber,
            weekStart,
            weekEnd,
            teamName
        };
        isDialogOpen = true;
    }
</script>

{#snippet cardImg(kytData, weekNumber, weekStart, weekEnd, teamName)}
    {@const isNextMonthWeek = isNextMonth({start: weekStart, end: weekEnd}, currentMonthName)}
    <div
        class="rounded-xl md:rounded-2xl relative aspect-4/3 overflow-hidden group {cardWidthClass} cursor-pointer transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-pink-600 {isNextMonthWeek ? 'ring-2 ring-blue-400' : ''}"
        onclick={() => kytData && openKytDialog(kytData, weekNumber, weekStart, weekEnd, teamName)}
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === 'Enter' && kytData) openKytDialog(kytData, weekNumber, weekStart, weekEnd, teamName); }}
    >
        {#if kytData}
            <!-- KYT Submitted - Show Image & Data -->
            <img
                src={assetUrl(kytData.image,{query:{
                                    t: dateparams


                                }})}
                alt={kytData.title}
                class="w-full h-full object-contain"
            />

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20"></div>

            <!-- Next Month Badge -->
            {#if isNextMonthWeek}
                <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-lg">
                    {getMonthName(weekStart)}
                </div>
            {/if}

            <!-- KYT Info - Bottom -->
            <div class="absolute pb-3 px-3 sm:pb-4 sm:px-4 md:pb-5 md:px-5 inset-x-0 bottom-0 flex flex-col justify-end space-y-2 sm:space-y-3">
                <!-- Week Number -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <span class="bg-pink-600 text-white text-xs sm:text-sm md:text-base font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded w-fit">
                        Minggu {weekNumber}
                    </span>
                    <span class="text-white/70 text-xs sm:text-sm">
                        {formatWeekRange(weekStart, weekEnd)}
                    </span>
                </div>

                <!-- KYT Title -->
                <h3 class="text-white font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-2">
                    {kytData.title}
                </h3>

                <!-- KYT Description -->
                <p class="text-white/80 text-xs sm:text-sm md:text-base leading-tight line-clamp-2">
                    {kytData.desc}
                </p>

                <!-- Divider -->
                <div class="border-t border-white/20 my-1 sm:my-2"></div>

                <!-- Submitted By -->
                <div class="flex items-center text-xs sm:text-sm">
                    <span class="text-white/70 truncate">
                        📝 {kytData.submittedBy}
                    </span>
                </div>
            </div>

            <!-- Hover Effect Overlay -->
            <div class="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/10 transition-colors duration-300"></div>
        {:else}
            <!-- Week Not Submitted - Empty State -->
            <div class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 relative">
                <!-- Next Month Badge -->
                {#if isNextMonthWeek}
                    <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-lg">
                        {getMonthName(weekStart)}
                    </div>
                {/if}

                <div class="text-center space-y-2 sm:space-y-3">
                    <div class="text-3xl sm:text-4xl md:text-5xl opacity-30">📋</div>
                    <div class="bg-gray-300 text-gray-600 text-xs sm:text-sm md:text-base font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded">
                        Minggu {weekNumber}
                    </div>
                    <p class="text-xs sm:text-sm text-gray-500 font-medium">
                        {formatWeekRange(weekStart, weekEnd)}
                    </p>
                    <div class="pt-2 sm:pt-3">
                        <p class="text-xs sm:text-sm font-semibold text-gray-600">Belum Submit</p>
                        <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">KYT minggu ini</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/snippet}

<AdminLayout>
    <div class="space-y-4 md:space-y-6 px-2 sm:px-0">
        <div class="text-center">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                List KYT {currentMonthName} {currentYear}
            </h1>
            <p class="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
                KIKEN YOCHI TRAINING (KYT)
            </p>
        </div>

        <!-- Each Team gets a Card Row -->
        {#each teams as team}
            {@const submittedCount = Object.values(team.weeklyKYT).filter(k => k !== null).length}
            {@const notSubmittedCount = weeks.length - submittedCount}

            <Card.Root class="border-2 hover:border-pink-600/50 transition-colors">
                <Card.Header class="bg-linear-to-r from-pink-50 to-blue-50 p-4 md:p-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div class="w-full sm:w-auto">
                            <Card.Title class="text-xl sm:text-2xl font-bold text-pink-600">
                                {team.name}
                            </Card.Title>
                            <Card.Description class="whitespace-pre-line text-sm md:text-base mt-1">
                                {team.desc}
                            </Card.Description>
                        </div>
                        <div class="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-auto justify-between sm:justify-end">
                            <span class="text-xs sm:text-sm font-medium text-muted-foreground">
                                {weeks.length} Minggu
                            </span>
                            <div class="flex items-center gap-1 text-xs">
                                <span class="bg-green-600 text-white px-2 py-0.5 rounded font-semibold">
                                    ✓ {submittedCount}
                                </span>
                                {#if notSubmittedCount > 0}
                                    <span class="bg-gray-500 text-white px-2 py-0.5 rounded font-semibold">
                                        ✗ {notSubmittedCount}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>
                </Card.Header>
                <Card.Content class="pt-4 md:pt-6 p-3 md:p-6">
                    <div class="flex flex-wrap gap-2 md:gap-3 justify-center">
                        <!-- Show 4 or 5 cards based on weeks in month -->
                        {#each weeks as week, weekIndex (weekIndex)}
                            {@const weekNumber = week.week_number || (weekIndex + 1)}
                            {@const kytData = team.weeklyKYT[week.id]}
                            {@render cardImg(kytData, weekNumber, week.start, week.end, team.name)}
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>

    <!-- View KYT Dialog -->
    <Dialog.Root bind:open={isDialogOpen}>
        <Dialog.Content class="md:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title class="text-2xl font-bold text-pink-600">
                    {#if selectedKyt}
                        KYT Details - {selectedKyt.title}
                    {:else}
                        KYT Details
                    {/if}
                </Dialog.Title>
                <Dialog.Description>
                    {#if selectedKyt}
                        <div class="flex flex-wrap gap-2 text-sm">
                            <span class="font-semibold">Team: {selectedKyt.teamName}</span>
                            <span>•</span>
                            <span>Week {selectedKyt.weekNumber}</span>
                            <span>•</span>
                            <span>{formatWeekRange(selectedKyt.weekStart, selectedKyt.weekEnd)}</span>
                        </div>
                    {/if}
                </Dialog.Description>
            </Dialog.Header>

            {#if selectedKyt}
                <div class="space-y-6 py-4">
                    <!-- KYT Result Image -->
                    <div class="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                        <img
                            src={assetUrl(selectedKyt.image,{query:{
                                    t: dateparams


                                }})}
                            alt={selectedKyt.title}
                            class="w-full h-auto object-contain"
                        />
                    </div>

                    <!-- KYT Information -->
                    <div class="space-y-4">
                        <!-- Title -->
                        <div class="bg-pink-50 p-4 rounded-lg">
                            <h3 class="text-sm font-semibold text-pink-800 mb-2">Judul KYT</h3>
                            <p class="text-base font-medium">{selectedKyt.title}</p>
                        </div>

                        <!-- Description -->
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h3 class="text-sm font-semibold text-blue-800 mb-2">Potensi Bahaya</h3>
                            <p class="text-base whitespace-pre-line">{selectedKyt.desc}</p>
                        </div>

                        <!-- Submitted By -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="text-sm font-semibold text-gray-800 mb-2">Disampaikan Oleh</h3>
                            <p class="text-base">{selectedKyt.submittedBy}</p>
                        </div>
                    </div>
                    <div class="rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400">
                        {#if !selectedKyt.status}
                            <div class="text-2xl tracking-tight">Tidak Ada Penanganan</div>
                        {:else}
                            <div class="text-2xl tracking-tight">Penanganan yang dilakukan:</div>
                            <img
                                src={assetUrl(selectedKyt.status.result_path,{query:{
                                    t: dateparams


                                }})}
                                alt={selectedKyt.title}
                                class="w-full h-auto object-contain"
                            />
                        {/if}
                    </div>
                </div>
            {/if}
        </Dialog.Content>
    </Dialog.Root>
</AdminLayout>
