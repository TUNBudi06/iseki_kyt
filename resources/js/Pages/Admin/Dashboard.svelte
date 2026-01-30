<script>
    import CardBodyImg from "$/lib/component/CardBodyImg.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import { page } from "@inertiajs/svelte";
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";

    let { weeksInCurrentMonth = [], currentYear = 2026, currentMonthName = "January" } = $props();

    $inspect($page.props)
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

    const teams = [
        {
            name: "DST",
            desc: "PENGECEKAN KUALITAS KOMPONEN DST",
            weeklyKYT: [
                {
                    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
                    title: "HANDLING OIL FILTER",
                    desc: "POTENSI TUMPAHAN OIL",
                    submittedBy: "Dedi Kurniawan"
                },
                null, // Week 2 - Not submitted
                {
                    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop",
                    title: "INSPEKSI KABEL SENSOR",
                    desc: "POTENSI KONSLETING LISTRIK",
                    submittedBy: "Budi Santoso"
                },
                {
                    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop",
                    title: "PENGECEKAN KOMPONEN BEARING",
                    desc: "POTENSI KERUSAKAN BEARING",
                    submittedBy: "Ahmad Sutrisno"
                }
            ]
        },
        {
            name: "MowColl-Inspeksi",
            desc: "INSPEKSI VISUAL BODY & CAT",
            weeklyKYT: [
                {
                    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop",
                    title: "CEK PANEL BODY",
                    desc: "POTENSI PANEL TIDAK PAS",
                    submittedBy: "Hadi Susanto"
                },
                {
                    image: "https://images.unsplash.com/photo-1619642751220-e3f2c34f98fa?w=800&auto=format&fit=crop",
                    title: "INSPEKSI LAMPU & KABEL",
                    desc: "POTENSI KORSLETING",
                    submittedBy: "Gunawan Adi"
                },
                {
                    image: "https://images.unsplash.com/photo-1619642751456-c3c5a9e2e9b5?w=800&auto=format&fit=crop",
                    title: "CEK DIMENSI BODY",
                    desc: "POTENSI DIMENSI TIDAK SESUAI",
                    submittedBy: "Fajar Rahman"
                },
                {
                    image: "https://images.unsplash.com/photo-1619642751789-f4f3e5e2c8e9?w=800&auto=format&fit=crop",
                    title: "INSPEKSI WARNA CAT",
                    desc: "POTENSI CAT TIDAK MERATA",
                    submittedBy: "Eko Prasetyo"
                }
            ]
        },
        {
            name: "Sub-Engine - Transmisi",
            desc: "PERAKITAN ENGINE & TRANSMISI",
            weeklyKYT: [
                null, // Week 1 - Not submitted
                {
                    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop",
                    title: "PEMASANGAN FUEL LINE",
                    desc: "POTENSI KEBOCORAN BBM",
                    submittedBy: "Kurniawan Aji"
                },
                {
                    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop",
                    title: "INSTALASI ENGINE MOUNT",
                    desc: "POTENSI MOUNTING TIDAK KUAT",
                    submittedBy: "Joko Widodo"
                },
                {
                    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
                    title: "PEMASANGAN GEAR BOX",
                    desc: "POTENSI SALAH TORQUE",
                    submittedBy: "Indra Gunawan"
                }
            ]
        },
        {
            name: "Painting",
            desc: "PROSES PENGECATAN BODY",
            weeklyKYT: [
                {
                    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
                    title: "SETTING SPRAY GUN",
                    desc: "POTENSI TEKANAN BERLEBIH",
                    submittedBy: "Putra Ananda"
                },
                {
                    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop",
                    title: "APLIKASI BASE COAT",
                    desc: "POTENSI INHALE GAS BERBAHAYA",
                    submittedBy: "Oki Setiawan"
                },
                null, // Week 3 - Not submitted
                {
                    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&auto=format&fit=crop",
                    title: "MIXING CAT & THINNER",
                    desc: "POTENSI KONTAMINASI CAT",
                    submittedBy: "Mulyono Adi"
                }
            ]
        },
        {
            name: "Sub Assy Mainline",
            desc: "PERAKITAN SUB ASSY MAINLINE",
            weeklyKYT: [
                {
                    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop",
                    title: "FITTING BRAKE LINE",
                    desc: "POTENSI KEBOCORAN REM",
                    submittedBy: "Toni Setiawan"
                },
                {
                    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
                    title: "ROUTING KABEL BAWAH",
                    desc: "POTENSI KABEL TERJEPIT",
                    submittedBy: "Sandi Wijaya"
                },
                {
                    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop",
                    title: "INSTALASI SUSPENSI",
                    desc: "POTENSI PEMASANGAN TERBALIK",
                    submittedBy: "Rudi Hartono"
                },
                {
                    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop",
                    title: "TORQUE BOLT CHASSIS",
                    desc: "POTENSI BOLT KURANG TORQUE",
                    submittedBy: "Qomar Hidayat"
                }
            ]
        }
    ];

    // Calculate card width based on number of weeks (4 or 5) - responsive
    const cardWidthClass = $derived(weeks.length === 4
        ? "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(25%-0.75rem)]"  // Mobile: full, Tablet: 2 cols, Desktop: 4 cols
        : "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(20%-0.6rem)]");  // Mobile: full, Tablet: 2 cols, Desktop: 5 cols
</script>

{#snippet cardImg(kytData, weekIndex, weekStart, weekEnd)}
    <div class="rounded-xl md:rounded-2xl relative aspect-[16/9] overflow-hidden group {cardWidthClass} cursor-pointer transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-pink-600">
        {#if kytData}
            <!-- KYT Submitted - Show Image & Data -->
            <img
                src={kytData.image}
                alt={kytData.title}
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
                        {weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} -
                        {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                </div>

                <!-- KYT Title -->
                <h3 class="text-white font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-2">
                    {kytData.title}
                </h3>

                <!-- KYT Description -->
                <p class="text-white/80 text-[10px] sm:text-xs leading-tight line-clamp-1 sm:line-clamp-2">
                    {kytData.desc}
                </p>

                <!-- Divider -->
                <div class="border-t border-white/20 my-0.5 sm:my-1"></div>

                <!-- Submitted By -->
                <div class="flex items-center text-[10px] sm:text-xs">
                    <span class="text-white/70 truncate">
                        📝 {kytData.submittedBy}
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
                    <div class="bg-gray-300 text-gray-600 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 rounded">
                        Minggu {weekIndex + 1}
                    </div>
                    <p class="text-[10px] sm:text-xs text-gray-500 font-medium">
                        {weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} -
                        {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                    <div class="pt-1 sm:pt-2">
                        <p class="text-[10px] sm:text-xs font-semibold text-gray-600">Belum Submit</p>
                        <p class="text-[10px] sm:text-xs text-gray-500 hidden sm:block">KYT minggu ini</p>
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
            {@const submittedCount = team.weeklyKYT.filter(k => k !== null).length}
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
                        {#each weeks as week, weekIndex}
                            {@const kytData = team.weeklyKYT[weekIndex]}
                            {@render cardImg(kytData, weekIndex, week.start, week.end)}
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>
</AdminLayout>
