<script>
    import {Input} from "$shadcn/components/ui/input/index.ts";
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.ts";
    import * as Dialog from "$shadcn/components/ui/dialog/index.ts";
    import {Datatable, TableHandler, ThSort} from "@vincjo/datatables";
    import {Button} from "$shadcn/components/ui/button/index.ts";
    import * as Table from "$shadcn/components/ui/table/index.ts";
    import {Badge} from "$shadcn/components/ui/badge/index.ts";
    import leader, {kytdelete} from "$routes/leader/index.ts";
    import {routeUrl, assetUrl, buildRoute} from "@tunbudi06/inertia-route-helper";
    import {inertia as InertiaLink, router} from "@inertiajs/svelte";
    import {toast} from "svelte-sonner";
    import ModalKYTShow from "$/lib/component/ModalKYTShow.svelte";
    import {downloadKytImage} from "$/lib/download/KytImage.ts";
    import {downloadKytPptx} from "$/lib/download/KytPptx.ts";

    let {kytListDates, team} = $props();

    // Dialog state
    let isViewDialogOpen = $state(false);
    let selectedKyt = $state(null);

    // Function to open view dialog
    function viewKyt(kytData) {
        selectedKyt = kytData;
        isViewDialogOpen = true;
    }

    // Function to delete KYT
    function deleteKyt(kytId) {
        if (confirm('Are you sure you want to delete this KYT? This action cannot be undone.')) {
            router.delete(routeUrl(kytdelete({id: kytId})), {
                onSuccess: () => {
                    toast.success('KYT deleted successfully!');
                },
                onError: (errors) => {
                    const errorMsg = Object.values(errors).flat().join(', ');
                    toast.error(errorMsg || 'Failed to delete KYT');
                }
            });
        }
    }

    // Function to download as image
    async function downloadAsImage(kytData) {
        await downloadKytImage({result_path: kytData.result_path, title: kytData.title});
    }

    // Function to download as PowerPoint (create from scratch like KYT Preview)
    async function downloadAsPPT(kytData) {
        let pptx = await downloadKytPptx(kytData,team);
        try {
            // Save the file
            await pptx.writeFile({ fileName: `KYT_${kytData.title.replace(/\s+/g, '-')}.pptx` });
            toast.success('PowerPoint downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download PowerPoint');
            console.error('PPT Download error:', error);
        }
    }

    const table = new TableHandler([], {
        rowsPerPage: 10,
    });

    $effect(() => {
        // Format the data before setting it in the table
        const formattedData = kytListDates.map(dateList => {
            const kytEntries = dateList.kyt_lists || [];
            const hasSubmission = kytEntries.length > 0;

            return {
                ...dateList,
                kyt_lists: dateList.kyt_lists ? dateList.kyt_lists[0] : null,
                // Add computed properties
                formatted_date: new Date(dateList.kyt_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                weeks: new Date(dateList.kyt_date).toLocaleDateString('id-ID', {
                    month: 'long'
                }) + " Minggu Ke " + dateList.number_of_Weeks,
                formatted_created: new Date(dateList.created_at).toLocaleDateString('id-ID'),
                status_text: hasSubmission ? 'Submitted' : 'Not Submitted',
                has_submission: hasSubmission
            };
        });
        console.log(formattedData);
        table.setRows(formattedData);
    });
</script>


<svelte:head>
    <title>KYT Lists - Leader Dashboard</title>
</svelte:head>

<LeaderLayout>
    <Card.Root class="shadow-xl">
        <Card.Header class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
            <div class="flex justify-between w-full items-center">
                <div>
                    <Card.Title class="text-2xl font-bold text-white">KYT History</Card.Title>
                    <Card.Description class="text-pink-50">
                        {#if team}
                            View KYT history for {team.team_name}
                        {:else}
                            View all KYT history
                        {/if}
                    </Card.Description>
                </div>
            </div>
        </Card.Header>

        <Card.Content class="p-6">
            <div>
                <Datatable {table} basic>
                    <Table.Root>
                        <Table.Caption>A list of KYT dates and weeks.</Table.Caption>
                        <Table.Header>
                            <Table.Row>
                                <ThSort {table} field="id">
                                    <Table.Head>ID</Table.Head>
                                </ThSort>
                                <ThSort {table} field="kyt_date">
                                    <Table.Head>KYT Date</Table.Head>
                                </ThSort>
                                <ThSort {table} field="number_of_Weeks">
                                    <Table.Head>Week Number</Table.Head>
                                </ThSort>
                                <Table.Head>Status</Table.Head>
                                <Table.Head class="text-end">Actions</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as row}
                                <Table.Row>
                                    <Table.Cell class="font-medium">{row.id}</Table.Cell>
                                    <Table.Cell>{row.formatted_date}</Table.Cell>
                                    <Table.Cell>{row.weeks}</Table.Cell>
                                    <Table.Cell>
                                        {#if row.has_submission}
                                            <Badge variant="default" class="bg-green-500">{row.status_text}</Badge>
                                        {:else}
                                            <Badge variant="secondary">{row.status_text}</Badge>
                                        {/if}
                                    </Table.Cell>
                                    <Table.Cell class="text-end">
                                        {#if row.has_submission}
                                            <div class="flex gap-2 justify-end flex-wrap">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onclick={() => viewKyt(row.kyt_lists)}
                                                    class="flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                                    </svg>
                                                    View
                                                </Button>
                                                <a use:InertiaLink href={routeUrl(leader.kytedit({id: row.kyt_lists.id}))}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        class="flex items-center gap-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                        Edit
                                                    </Button>
                                                </a>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onclick={() => downloadAsImage(row.kyt_lists)}
                                                    class="flex items-center gap-1 bg-blue-50 hover:bg-blue-100"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                    </svg>
                                                    Image
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onclick={() => downloadAsPPT(row.kyt_lists)}
                                                    class="flex items-center gap-1 bg-orange-50 hover:bg-orange-100"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                    </svg>
                                                    PPT
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onclick={() => deleteKyt(row.kyt_lists.id)}
                                                    class="flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                    </svg>
                                                    Delete
                                                </Button>
                                            </div>
                                        {:else}
                                            <a use:InertiaLink href={routeUrl(leader.kytadd({IdKytDate: row.id}))}>
                                                <Button size="sm" class="flex items-center self-end gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                                    </svg>
                                                    Tambahkan KYT
                                                </Button>
                                            </a>
                                        {/if}
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </Datatable>
            </div>
        </Card.Content>
    </Card.Root>
    <ModalKYTShow bind:isOpen={isViewDialogOpen} {selectedKyt} />
</LeaderLayout>
