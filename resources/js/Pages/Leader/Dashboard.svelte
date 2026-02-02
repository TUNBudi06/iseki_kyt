<script lang="ts">
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import { page } from "@inertiajs/svelte";

    let { weeksInCurrentMonth = [], team = null, currentYear = 2026, currentMonthName = "January" } = $props();

    $inspect($page.props)

    const weeks = $derived.by(() => {
        // If no data from backend, generate dummy weeks
        if (!weeksInCurrentMonth || weeksInCurrentMonth.length === 0) {
            const currentDate = new Date();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            const monthIndex = monthNames.indexOf(currentMonthName);
            const month = monthIndex >= 0 ? monthIndex : currentDate.getMonth();
            const year = currentYear || currentDate.getFullYear();

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
        <div class="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-8 text-white">
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
            <Card.Header class="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg">
                <Card.Title class="text-2xl font-bold text-white">
                    {team?.team_name || 'Team'} - KYT This Month
                </Card.Title>
                <Card.Description class="text-pink-50">
                    {currentMonthName} {currentYear} - Weekly submissions
                </Card.Description>
            </Card.Header>
            <Card.Content class="pt-6">
                {#if team && team.weeklyKYT}
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <!-- Show cards based on weeks in month -->
                        {#each weeks as week, weekIndex}
                            {@const weekNumber = week.week_number || (weekIndex + 1)}
                            {@const kytData = team.weeklyKYT[weekNumber]}
                            {@const isNextMonthWeek = isNextMonth(week, currentMonthName)}
                            <div class="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer {isNextMonthWeek ? 'ring-2 ring-blue-400' : ''}">
                                {#if kytData && kytData.image_url}
                                    <!-- KYT Submitted - Show Image & Data -->
                                    <img
                                        src={kytData.image_url}
                                        alt="KYT Week {weekNumber}"
                                        class="w-full h-full object-cover m-0"
                                    />

                                    <!-- Gradient Overlay -->
                                    <div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20"></div>

                                    <!-- Next Month Badge -->
                                    {#if isNextMonthWeek}
                                        <div class="absolute top-2 right-2 bg-blue-500 text-white text-sm sm:text-base md:text-lg px-3 py-1.5 sm:py-2 rounded font-bold">
                                            {getMonthName(week.start)}
                                        </div>
                                    {/if}

                                    <!-- KYT Info - Bottom -->
                                    <div class="absolute pb-4 px-4 sm:pb-5 sm:px-5 md:pb-6 md:px-6 inset-x-0 bottom-0 flex flex-col justify-end space-y-3 sm:space-y-4">
                                        <!-- Week Number -->
                                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <span class="bg-pink-600 text-white text-base sm:text-lg md:text-xl font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit">
                                                Minggu {weekNumber}
                                            </span>
                                            <span class="text-white/70 text-sm sm:text-base md:text-lg">
                                                {formatWeekRange(week.start, week.end)}
                                            </span>
                                        </div>

                                        <!-- Submitted Date -->
                                        <div class="flex items-center text-base sm:text-lg md:text-xl">
                                            <span class="text-white/70 font-medium">
                                                ✅ Submitted
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Hover Effect Overlay -->
                                    <div class="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/10 transition-colors duration-300"></div>
                                {:else}
                                    <!-- Week Not Submitted - Empty State -->
                                    <div class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4 sm:p-5 md:p-6">
                                        <!-- Next Month Badge -->
                                        {#if isNextMonthWeek}
                                            <div class="absolute top-2 right-2 bg-blue-500 text-white text-sm sm:text-base px-3 py-2 rounded font-bold">
                                                {getMonthName(week.start)}
                                            </div>
                                        {/if}

                                        <div class="text-center space-y-3 sm:space-y-4">
                                            <div class="text-5xl sm:text-6xl md:text-7xl opacity-30">📋</div>
                                            <div class="text-base sm:text-lg md:text-xl font-semibold text-gray-500">Minggu {weekNumber}</div>
                                            <div class="text-sm sm:text-base md:text-lg text-gray-400">{formatWeekRange(week.start, week.end)}</div>
                                            <div class="mt-3 sm:mt-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-300/50 rounded text-sm sm:text-base md:text-lg text-gray-600 font-medium">
                                                Belum Submit
                                            </div>
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
</LeaderLayout>
