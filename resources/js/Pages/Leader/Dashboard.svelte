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
                    end: new Date(year, month, endDay)
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
                end: endDate
            });
        }

        return generatedWeeks;
    });

    const formatWeekRange = (start: Date, end: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
    };

    // Stats calculations
    const totalKytThisMonth = $derived(weeks.length);
    const kytSubmitted = $derived(team?.weeklyKYT?.filter((kyt: any) => kyt !== null && kyt.image_url).length || 0);
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
                            {@const kytData = team.weeklyKYT[weekIndex]}
                            <div class="group relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                                {#if kytData && kytData.image_url}
                                    <!-- KYT Submitted - Show Image & Data -->
                                    <img
                                        src={kytData.image_url}
                                        alt="KYT Week {weekIndex + 1}"
                                        class="w-full h-full object-cover m-0"
                                    />

                                    <!-- Gradient Overlay -->
                                    <div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20"></div>

                                    <!-- KYT Info - Bottom -->
                                    <div class="absolute pb-2 px-2 sm:pb-3 sm:px-3 md:pb-4 md:px-4 inset-x-0 bottom-0 flex flex-col justify-end space-y-1 sm:space-y-2">
                                        <!-- Week Number -->
                                        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                            <span class="bg-pink-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 rounded w-fit">
                                                Minggu {weekIndex + 1}
                                            </span>
                                            <span class="text-white/70 text-[10px] sm:text-xs">
                                                {formatWeekRange(week.start, week.end)}
                                            </span>
                                        </div>

                                        <!-- Submitted Date -->
                                        <div class="flex items-center text-[10px] sm:text-xs">
                                            <span class="text-white/70">
                                                ✅ Submitted
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Hover Effect Overlay -->
                                    <div class="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/10 transition-colors duration-300"></div>
                                {:else}
                                    <!-- Week Not Submitted - Empty State -->
                                    <div class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
                                        <div class="text-center space-y-1 sm:space-y-2">
                                            <div class="text-2xl sm:text-3xl md:text-4xl opacity-30">📋</div>
                                            <div class="text-xs sm:text-sm font-semibold text-gray-500">Minggu {weekIndex + 1}</div>
                                            <div class="text-[10px] sm:text-xs text-gray-400">{formatWeekRange(week.start, week.end)}</div>
                                            <div class="mt-1 sm:mt-2 px-2 sm:px-3 py-1 bg-gray-300/50 rounded text-[10px] sm:text-xs text-gray-600">
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
