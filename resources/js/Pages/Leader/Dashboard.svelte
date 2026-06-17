<script lang="ts">
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Dialog from "$shadcn/components/ui/dialog/index.js";
    import KytPreview from "$/Components/KytPreview.svelte";
    import { page, Link,inertia as InertiaLink } from "@inertiajs/svelte";
    import {assetUrl, routeUrl} from "@tunbudi06/inertia-route-helper";
    import leader, {kytadd, kytedit} from "$routes/leader";
    import {onMount} from "svelte";
    import {Button} from "$shadcn/components/ui/button";

    let { weeksInCurrentMonth = [], team = null, currentYear = 2026, currentMonthName = "January", bgKyt = "" } = $props();

    $inspect($page.props)

    // Dialog state
    let isDialogOpen = $state(false);
    let selectedKyt = $state<any>(null);

    let dateparams:number = $state(0);

    onMount(() => {
        dateparams = Date.now();
    })


    // Function to open dialog with KYT data
    function openKytDialog(kytData: any, weekNumber: number, week: any) {
        selectedKyt = {
            ...kytData,
            weekNumber,
            week
        };
        isDialogOpen = true;
    }

    const weeks = $derived.by(() => {
        // // If no data from backend, generate dummy weeks
        // if (!weeksInCurrentMonth || weeksInCurrentMonth.length === 0) {
        //     const currentDate = new Date();
        //     const monthNames = ["January", "February", "March", "April", "May", "June",
        //         "July", "August", "September", "October", "November", "December"];
        //     const monthIndex = monthNames.indexOf(currentMonthName);
        //     const month = monthIndex >= 0 ? monthIndex : currentDate.getMonth();
        //     const year = currentYear || currentDate.getFullYear();
        //
        //     // Generate 4 dummy weeks
        //     const generatedWeeks = [];
        //     for (let i = 0; i < 4; i++) {
        //         const startDay = i * 7 + 1;
        //         const endDay = Math.min((i + 1) * 7, new Date(year, month + 1, 0).getDate());
        //         generatedWeeks.push({
        //             start: new Date(year, month, startDay),
        //             end: new Date(year, month, endDay),
        //             week_number: i + 1
        //         });
        //     }
        //     return generatedWeeks;
        // }

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

    const formatWeekRange = (start: Date, end: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
    };

    const getMonthName = (date: Date) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[date.getMonth()];
    };

    // Check if week belongs to next month
    const isNextMonth = (week: any, currentMonthName: string) => {
        const weekMonth = getMonthName(week.start);
        return weekMonth !== currentMonthName;
    };

    // Stats calculations
    const totalKytThisMonth = $derived(weeks.length);
    const kytSubmitted = $derived.by(() => {
        if (!team?.weeklyKYT) return 0;
        // weeklyKYT is an object with week_number as keys, not an array
        return Object.values(team.weeklyKYT).filter((kyt: any) => kyt !== null && kyt?.image_url).length;
    });
    const kytNotSubmitted = $derived(weeks.length - kytSubmitted);
</script>

<svelte:head>
    <title>Dashboard - Leader Panel</title>
    <meta name="description" content="Leader dashboard for managing KYT submissions" />
</svelte:head>

<LeaderLayout>
    <div class="space-y-6">
        <!-- Welcome Section -->
        <div class="bg-linear-to-r from-pink-500 to-pink-600 rounded-lg p-8 text-white">
            <h1 class="text-3xl font-bold mb-2">
                Welcome back, {$page.props.auth?.user?.username || 'Leader'}!
            </h1>
            <p class="text-pink-100">
                Manage your team's KYT submissions and track safety initiatives
            </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card.Root class="border-2 border-pink-200">
                <Card.Header>
                    <Card.Title class="text-pink-600">Total KYT</Card.Title>
                    <Card.Description>This Month</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="text-4xl font-bold text-pink-600">{totalKytThisMonth}</div>
                </Card.Content>
            </Card.Root>

            <Card.Root class="border-2 border-pink-200">
                <Card.Header>
                    <Card.Title class="text-pink-600">KYT Yang disubmit</Card.Title>
                    <Card.Description>Submitted</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="text-4xl font-bold text-pink-600">{kytSubmitted}</div>
                </Card.Content>
            </Card.Root>

            <Card.Root class="border-2 border-pink-200">
                <Card.Header>
                    <Card.Title class="text-pink-600">KYT Belum DiSubmit</Card.Title>
                    <Card.Description>Not Submitted</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="text-4xl font-bold text-pink-600">{kytNotSubmitted}</div>
                </Card.Content>
            </Card.Root>
        </div>

        <!-- Weekly KYT Submissions -->
        <Card.Root>
            <Card.Header class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg">
                <Card.Title class="text-2xl font-bold text-white">
                    {team?.team_name || 'Team'} - KYT This Month
                </Card.Title>
                <Card.Description class="text-pink-50">
                    {currentMonthName} {currentYear} - Weekly submissions
                </Card.Description>
            </Card.Header>
            <Card.Content class="pt-6">
                {#if team && team.weeklyKYT}
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <!-- Show cards based on weeks in month -->
                        {#each weeks as week, weekIndex (weekIndex)}
                            {@const weekNumber = week.week_number || (weekIndex + 1)}
                            {@const kytData = team.weeklyKYT[week.id]}
                            <!--{@debug weekNumber}-->
                            {@const isNextMonthWeek = isNextMonth(week, currentMonthName)}
                            <div class="group relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer {isNextMonthWeek ? 'ring-2 ring-blue-400' : ''}">
                                {#if kytData && kytData.image_url}
                                    <!-- KYT Submitted - Show Image & Data -->
                                    <img
                                        src={assetUrl(kytData.image_url,{query:{
                                    t: dateparams


                                }})}
                                        alt="KYT Week {weekNumber}"
                                        class="w-full h-full object-contain"
                                    />

                                    <!-- Gradient Overlay -->
                                    <div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20"></div>

                                    <!-- Next Month Badge -->
                                    {#if isNextMonthWeek}
                                        <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 rounded font-bold shadow-lg">
                                            {getMonthName(week.start)}
                                        </div>
                                    {/if}

                                    <!-- KYT Info - Bottom -->
                                    <div class="absolute pb-2 px-3 sm:pb-3 sm:px-4 inset-x-0 bottom-0 flex flex-col justify-end space-y-1">
                                        <!-- Week Number -->
                                        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span class="bg-pink-600 text-white text-sm sm:text-base md:text-lg font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded w-fit shadow-lg">
                                                Minggu {weekNumber}
                                            </span>
                                            <span class="text-white/90 text-xs sm:text-sm md:text-base font-medium">
                                                {formatWeekRange(week.start, week.end)}
                                            </span>
                                        </div>

                                        <!-- Submitted Date -->
                                        <div class="flex items-center text-xs sm:text-sm md:text-base">
                                            {#if kytData.status}
                                                <span class="text-white/90 font-medium">
                                                    ✅ Submitted
                                                </span>
                                            {:else}
                                                <span class="text-white font-medium">
                                                    ⛔ Menunggu penanganan
                                                </span>
                                            {/if}
                                        </div>
                                    </div>

                                    <!-- Hover Effect Overlay with View Button -->
                                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                        <button
                                            onclick={() => openKytDialog(kytData, weekNumber, week)}
                                            class="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base md:text-lg flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                            </svg>
                                            Lihat KYT
                                        </button>
                                    </div>
                                {:else}
                                    <!-- Week Not Submitted - Empty State -->
                                    <div class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-3 sm:p-4 relative">
                                        <!-- Next Month Badge -->
                                        {#if isNextMonthWeek}
                                            <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 rounded font-bold shadow-lg">
                                                {getMonthName(week.start)}
                                            </div>
                                        {/if}

                                        <div class="text-center space-y-2">
                                            <div class="text-4xl sm:text-5xl md:text-6xl opacity-30">📋</div>
                                            <div class="text-sm sm:text-base md:text-lg font-bold text-gray-600">Minggu {weekNumber}</div>
                                            <div class="text-xs sm:text-sm md:text-base text-gray-500 font-medium">{formatWeekRange(week.start, week.end)}</div>
                                            <div class="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300/50 rounded text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                                                Belum Submit
                                            </div>
                                        </div>

                                        <!-- Hover Effect Overlay with Add Button -->
                                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                            <Link
                                                href={routeUrl(kytadd({IdKytDate:kytData.kyt_date_id}))}
                                                class="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base md:text-lg flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                                </svg>
                                                Tambahkan KYT
                                            </Link>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-12 text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-lg">No team data available</p>
                        <p class="text-sm text-gray-400">Please contact administrator</p>
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>

    <!-- KYT Detail Dialog -->
    <Dialog.Root bind:open={isDialogOpen}>
        <Dialog.Content class="md:max-w-5xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title class="text-2xl font-bold text-pink-600">
                    {#if selectedKyt}
                        Preview KYT - Minggu {selectedKyt.weekNumber}
                    {:else}
                        Preview KYT
                    {/if}
                </Dialog.Title>
                <Dialog.Description>
                    {#if selectedKyt}
                        {formatWeekRange(selectedKyt.week.start, selectedKyt.week.end)} · {team?.team_name || 'Team'}
                    {/if}
                </Dialog.Description>
            </Dialog.Header>

            {#if selectedKyt}
                <div class="py-4 space-y-6">
                    <!-- KYT Preview like editor -->
                    <div>
                        <KytPreview
                            scaleToFit={true}
                            bgKyt={bgKyt}
                            kytDate={selectedKyt.week.start}
                            kytTeam={team?.team_name || ''}
                            kytTitle={selectedKyt.title || ''}
                            savedImageUrl={selectedKyt.foto_path ? assetUrl(selectedKyt.foto_path,{query:{t: dateparams}}) : (selectedKyt.image_url ? assetUrl(selectedKyt.image_url,{query:{t: dateparams}}) : '')}
                            kytPic={selectedKyt.user_name || ''}
                            kytPotensi={selectedKyt.potensi || ''}
                            kytPenanganan={selectedKyt.penanganan || ''}
                        />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">
                        <div class="flex flex-wrap items-center gap-2">
                            {#if !selectedKyt.status}
                                <a use:InertiaLink href={routeUrl(leader.penangananadd({kytListId: selectedKyt.id}))}>
                                    <Button
                                        variant="outline"
                                        class="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                        </svg>
                                        Add Penanganan
                                    </Button>
                                </a>
                            {/if}
                            <Link
                                href={routeUrl(kytedit({id: selectedKyt.id}))}
                            >
                                <Button
                                    variant="outline"
                                    class="flex items-center gap-2 bg-blue-50 hover:bg-blue-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit KYT
                                </Button>
                            </Link>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-muted-foreground">
                                {#if selectedKyt.status}
                                    ✅ Submitted
                                {:else}
                                    ⛔ Menunggu penanganan
                                {/if}
                            </span>
                            {#if selectedKyt.submitted_at}
                                <span class="text-xs text-muted-foreground">
                                    {new Date(selectedKyt.submitted_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </Dialog.Content>
    </Dialog.Root>
</LeaderLayout>
