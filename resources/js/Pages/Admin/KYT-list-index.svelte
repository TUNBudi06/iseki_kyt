<script lang="ts">
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Dialog from "$shadcn/components/ui/dialog/index.js";
    import {Combobox} from "$shadcn/components/ui/combobox/index.js";
    import {Datatable, TableHandler,Pagination,RowCount,ThSort} from "@vincjo/datatables";
    import * as Table from "$shadcn/components/ui/table/index.js";
    import * as Field from "$shadcn/components/ui/field/index.js";
    import {Button} from "$shadcn/components/ui/button/index.js";
    import dayjs from "dayjs";
    import {assetUrl, routeUrl} from "@tunbudi06/inertia-route-helper";
    import {EmptySliceAdderKyt, initPptxKyt, PenangananSliceKyt, SliceAdderKyt} from "$lib/download/KytPptx.ts";
    import {toast} from "svelte-sonner";
    import {router} from "@inertiajs/svelte";
    import {list as kytListRoute} from "$routes/admin/kyt";
    import {onMount} from "svelte";
    import * as Tooltip from "$shadcn/components/ui/tooltip/index.js";

    let dateparams:number = $state(0);

    onMount(() => {
        dateparams = Date.now();
    });

    let {kytLists, teamKyt, auth, availableMonths, selectedMonthYear} = $props();

    // Dialog state
    let isDialogOpen = $state(false);
    let selectedKyts = $state<any[]>([]);

    // Month filter state - reactive to prop changes
    let monthFilter = $state('');

    // Initialize and sync monthFilter with selectedMonthYear prop
    $effect(() => {
        monthFilter = selectedMonthYear;
    });


    const table = new TableHandler([],{
        highlight: true
    });

    $effect(() => {
        let data = kytLists.map((item: any, index: number) => {
            return {
                no: index + 1,
                id: item.id,
                minggu_kyt: dayjs(item.kyt_date).format("MMM YYYY") +` Week ${item.number_of_Weeks}`,
                kyt_date: item.kyt_date,
                kyt_lists: item.kyt_lists, // Store full kyt_lists for reference
                ...teamKyt.reduce((acc: any, team: any) => {
                    const teamKyt = item.kyt_lists.find((t: any) => t.team_k_y_t_id === team.id);
                    if (teamKyt) {
                        if(teamKyt.penanganans){
                            acc[team.team_name] = '✓';
                        } else {
                            acc[team.team_name] = '-';
                        }
                    } else {
                        acc[team.team_name] = '✗';
                    }
                    return acc;
                }, {}),
            }
        });


        table.setRows(data);
    });


    // Function to open dialog with KYT details for specific week
    function viewKytDetails(row: any) {
        selectedKyts = row.kyt_lists.map((kyt: any) => ({
            ...kyt,
            team_name: teamKyt.find((t: any) => t.id === kyt.team_k_y_t_id)?.team_name || 'Unknown Team'
        }));
        isDialogOpen = true;
    }

    async function downloadAsPPT(row: any) {
        const pptx = await initPptxKyt(auth.user.username,row.minggu_kyt)
        for (const team of teamKyt) {
            const kytData = row.kyt_lists.find((kyt: any) => kyt.team_k_y_t_id === team.id);
            if (kytData) {
                SliceAdderKyt(pptx, kytData, team);
                if(kytData.penanganans){
                    PenangananSliceKyt(pptx, kytData.penanganans.penanganan_title, kytData.penanganans.foto_path);
                } else  {
                    PenangananSliceKyt(pptx, "Penanganan Belum submit");
                }
            } else {
                EmptySliceAdderKyt(pptx, team);
                PenangananSliceKyt(pptx, "KYT Tidak Diajukan");
            }
        }
        try {
            // Save the file
            await pptx.writeFile({ fileName: `KYT_${row.minggu_kyt.replace(/\s+/g, '-')}.pptx` });
            toast.success('PowerPoint downloaded successfully!');
        } catch (error) {
            console.error('PPT Download error:', error);
        }
    }

    // Handle month filter change
    $effect(() => {
        if (monthFilter !== selectedMonthYear && monthFilter !== '') {
            router.get(routeUrl(kytListRoute({
                query: { month_year: monthFilter
                }})), {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    });

</script>

{#snippet tooltips(icon,text,className)}
    <Tooltip.Root>
        <Tooltip.Trigger class={className}>{icon}</Tooltip.Trigger>
        <Tooltip.Content>
            {text}
        </Tooltip.Content>
    </Tooltip.Root>
{/snippet}

<AdminLayout>
    <Card.Root>
        <Card.Header class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
            <div class="flex justify-between w-full items-center">
                <div>
                    <Card.Title class="text-2xl font-bold text-white">KYT Lists</Card.Title>
                    <Card.Description class="text-pink-50">Manage and view all KYT.</Card.Description>
                </div>
            </div>
        </Card.Header>
        <Card.Content>
            <Datatable {table}>
                {#snippet header()}
                    <div class="w-full pt-5 pb-2">
                        <div class="flex items-center gap-4">
                            <Field.Group class="flex-1 max-w-md">
                                <Field.Field>
                                    <Field.Label>Filter by Month:</Field.Label>
                                    <Combobox
                                        items={availableMonths}
                                        bind:value={monthFilter}
                                        placeholder="Select month or search..."
                                        emptyMessage="No months found."
                                        class="w-full"
                                    />
                                </Field.Field>
                            </Field.Group>
                        </div>
                    </div>
                {/snippet}
                <Table.Root>
                    <Table.Caption>A list of KYT submissions by week and team.</Table.Caption>
                    <Table.Header>
                        <Table.Row>
                            <ThSort {table} field="no" >
                                <Table.Head class="w-12 px-2 py-2 text-xs">No</Table.Head>
                            </ThSort>
                            <ThSort {table} field="minggu_kyt" >
                                <Table.Head class="px-3 py-2 text-xs">Minggu KYT</Table.Head>
                            </ThSort>
                            {#each teamKyt as team}
                                <ThSort {table} field={team.team_name} >
                                    <Table.Head class="max-w-20 px-2 py-2 text-xs">
                                        <p class="text-balance text-center leading-tight">{team.team_name}</p>
                                    </Table.Head>
                                </ThSort>
                            {/each}
                            <Table.Head class="text-end px-3 py-2 text-xs">Actions</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each table.rows as row (row.no)}
                            <Table.Row class="hover:bg-muted/50">
                                <Table.Cell class="font-medium px-2 py-2 text-xs">{row.no}</Table.Cell>
                                <Table.Cell class="px-3 py-2 text-xs">{@html row.minggu_kyt}</Table.Cell>
                                {#each teamKyt as team}
                                    <Table.Cell class="text-center px-2 py-2 text-xs">
                                        {#if row[team.team_name] === '✓'}
                                            {@render tooltips(row[team.team_name],
                                                "KYT submitted Dan Sudah ditangani",
                                                "inline-block bg-green-100 rounded-full px-2 py-0.5")}
                                        {:else if row[team.team_name] === '-'}
                                            {@render tooltips(row[team.team_name],
                                                "KYT submitted Dan Belum ditangani",
                                                "inline-block bg-yellow-100 rounded-full px-2 py-0.5")}
                                        {:else}
                                            {@render tooltips(row[team.team_name],
                                                "KYT BELUM DI SUBMIT",
                                                "inline-block bg-red-100 rounded-full px-2 py-0.5")}
                                        {/if}
                                    </Table.Cell>
                                {/each}
                                <Table.Cell class="text-end flex gap-1 px-3 py-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onclick={() => viewKytDetails(row)}
                                        disabled={row.kyt_lists.length === 0}
                                        class="flex items-center gap-1 h-8 px-2 text-xs"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                        </svg>
                                        View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onclick={() => downloadAsPPT(row)}
                                        disabled={row.kyt_lists.length === 0}
                                        class="flex items-center gap-1 h-8 px-2 text-xs bg-orange-50 hover:bg-orange-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                        PPT
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
                {#snippet footer()}
                    <RowCount {table}/>
                    <Pagination {table}/>
                {/snippet}
            </Datatable>
        </Card.Content>
    </Card.Root>

    <!-- View KYT Details Dialog -->
    <Dialog.Root bind:open={isDialogOpen}>
        <Dialog.Content class="md:max-w-7xl max-h-[90vh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title class="text-2xl font-bold text-pink-600">
                    KYT Submissions
                </Dialog.Title>
                <Dialog.Description>
                    View all team submissions for the selected week
                </Dialog.Description>
            </Dialog.Header>

            <div class="space-y-8 py-4">
                {#if selectedKyts.length === 0}
                    <div class="text-center py-8 text-muted-foreground">
                        No KYT submissions for this week
                    </div>
                {:else}
                    {#each selectedKyts as kyt}
                        <div class="border-2 border-pink-200 rounded-lg p-6 space-y-4">
                            <!-- Team Header -->
                            <div class="flex items-center justify-between border-b-2 border-pink-200 pb-3">
                                <h3 class="text-xl font-bold text-pink-600">
                                    {kyt.team_name}
                                </h3>
                                <span class="text-sm text-muted-foreground">
                                    Submitted by {kyt.user_name}
                                </span>
                            </div>

                            <!-- KYT Result Image -->
                            <div class="rounded-lg overflow-auto shadow-lg bg-gray-100">
                                <img
                                    src={assetUrl(kyt.result_path,{query:{
                                    t: dateparams
                                }})}
                                    alt={kyt.title}
                                    class="w-full h-auto object-contain"
                                />
                            </div>

                            <!-- KYT Information -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Title -->
                                <div class="bg-pink-50 p-4 rounded-lg">
                                    <h4 class="text-sm font-semibold text-pink-800 mb-2">Judul KYT</h4>
                                    <p class="text-base font-medium">{kyt.title}</p>
                                </div>

                                <!-- Submitted By -->
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <h4 class="text-sm font-semibold text-gray-800 mb-2">Disampaikan Oleh</h4>
                                    <p class="text-base">{kyt.user_name}</p>
                                </div>

                                <!-- Potensi Bahaya -->
                                <div class="bg-blue-50 p-4 rounded-lg md:col-span-2">
                                    <h4 class="text-sm font-semibold text-blue-800 mb-2">Potensi Bahaya</h4>
                                    <p class="text-base whitespace-pre-line">{kyt.potensi}</p>
                                </div>

                                <!-- Penanganan -->
                                <div class="bg-green-50 p-4 rounded-lg md:col-span-2">
                                    <h4 class="text-sm font-semibold text-green-800 mb-2">Penanganan</h4>
                                    <p class="text-base whitespace-pre-line">{kyt.penanganan}</p>
                                </div>
                            </div>
                            {#if kyt.penanganans}
                                <div class="flex items-center pt-4 justify-between border-b-2 border-pink-200 pb-3">
                                    <h3 class="text-xl font-bold text-yellow-600">
                                        Penanganan:
                                    </h3>
                                </div>
                                <!-- KYT Penanganan Result Image -->
                                <div class="rounded-lg overflow-auto shadow-lg bg-gray-100">
                                    <img
                                        src={assetUrl(kyt.penanganans.result_path,{query:{
                                    t: dateparams
                                }})}
                                        alt={kyt.penanganans.title}
                                        class="w-300 h-170 object-contain"
                                    />
                                </div>
                            {:else}
                                <div class="flex items-center pt-4 justify-between border-b-2 border-pink-200 pb-3">
                                    <h3 class="text-xl font-bold text-yellow-600">
                                        Belum Ada Penanganan
                                    </h3>
                                </div>
                            {/if}

                        </div>
                    {/each}
                {/if}
            </div>
        </Dialog.Content>
    </Dialog.Root>
</AdminLayout>
