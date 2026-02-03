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
        try {
            const imageUrl = assetUrl(kytData.result_path);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `KYT_${kytData.title.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Image downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download image');
            console.error('Download error:', error);
        }
    }

    // Function to download as PowerPoint (create from scratch like KYT Preview)
    async function downloadAsPPT(kytData) {
        try {
            // Import PptxGenJS dynamically
            const PptxGenJS = (await import('pptxgenjs')).default;
            const pptx = new PptxGenJS();

            // Set presentation properties to match PPT size (1280x720 = 16:9)
            pptx.layout = 'LAYOUT_16x9';
            pptx.author = kytData.user_name;
            pptx.title = `KYT - ${kytData.title}`;

            // Create main KYT slide
            const slide = pptx.addSlide();

            // 1. Add Background Image (bg-kyt.jpg) - Full slide
            slide.addImage({
                path: buildRoute('/assets/img/bg-kyt.jpg'),
                x: 0,
                y: 0,
                w: '100%',
                h: '100%',
                sizing: {
                    type: 'contain',
                    w: '100%',
                    h: '100%'
                }
            });

            // 2. Add Team Name (if available)
            // Position: offsetX: 750px, offsetY: 0px, width: 530px, height: 10px (in 1280x720)
            // Convert to inches: x=5.86", y=0", w=4.14", h=0.08"
            if (team && team.team_name) {
                slide.addText(team.team_name, {
                    x: 5.86,
                    y: 0,
                    w: 4.14,
                    h: 0.5,
                    fontSize: 18,
                    bold: true,
                    color: '404040',
                    align: 'center',
                    valign: 'top',
                    shadow: {
                        type: 'outer',
                        blur: 3,
                        offset: 2.5,
                        angle: 45,
                        color: '000000',
                        opacity: 0.4
                    }
                });
            }

            // 3. Add Title Text Box
            // Position: offsetX: 50px, offsetY: 80px, width: 680px, height: 50px
            // Convert: x=0.39", y=0.63", w=5.31", h=0.39"
            slide.addText(kytData.title.toUpperCase(), {
                x: 0.39,
                y: 0.53,
                w: 5.31,
                h: 0.5,
                fontSize: 15,
                bold: true,
                color: '000000',
                align: 'center',
                valign: 'middle'
            });

            // 4. Add Edited Image (foto_path) - The edited canvas image
            // Position: offsetX: 50px, offsetY: 133px, width: 680px, height: 502px
            // Convert: x=0.39", y=1.04", w=5.31", h=3.92"
            if (kytData.foto_path) {
                const fotoUrl = assetUrl(kytData.foto_path);
                slide.addImage({
                    path: fotoUrl,
                    x: 0.39,
                    y: 1.04,
                    w: 5.31,
                    h: 3.92,
                    sizing: {
                        type: 'contain',
                        w: 5.31,
                        h: 3.92
                    }
                });
            }

            // 5. Add Date (bottom right)
            // Position: offsetX: 780px, offsetY: 650px
            // Convert: x=6.09", y=5.08"
            const formattedDate = new Date(kytData.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            slide.addText(formattedDate, {
                x: 6.09,
                y: 5.08,
                w: 3.5,
                h: 0.5,
                fontSize: 28,
                bold: true,
                color: '2F5597',
                align: 'right',
                valign: 'bottom',
                shadow: {
                    type: 'outer',
                    blur: 3,
                    offset: 2.5,
                    angle: 45,
                    color: '000000',
                    opacity: 0.4
                }
            });

            // 6. Add "DISAMPAIKAN OLEH :" Label
            // Position: offsetX: 800px, offsetY: 100px, width: 430px, height: 35px
            // Convert: x=6.25", y=0.78", w=3.36", h=0.27"
            slide.addText('DISAMPAIKAN OLEH :', {
                x: 6.25,
                y: 0.78,
                w: 3.36,
                h: 0.35,
                fontSize: 18,
                bold: true,
                color: 'FF0000',
                align: 'left',
                valign: 'top'
            });

            // 7. Add PIC Name Value
            // Position: offsetX: 800px, offsetY: 125px, width: 430px, height: 40px
            // Convert: x=6.25", y=0.98", w=3.36", h=0.31"
            slide.addText(kytData.user_name, {
                x: 6.25,
                y: 1.03,
                w: 3.36,
                h: 0.4,
                fontSize: 16,
                bold: true,
                color: '000000',
                align: 'left',
                valign: 'top'
            });

            // 8. Add "POTENSI BAHAYA :" Label
            // Position: offsetX: 800px, offsetY: 180px, width: 430px, height: 35px
            // Convert: x=6.25", y=1.41", w=3.36", h=0.27"
            slide.addText('POTENSI BAHAYA :', {
                x: 6.25,
                y: 1.48,
                w: 3.36,
                h: 0.35,
                fontSize: 18,
                bold: true,
                color: 'FF0000',
                align: 'left',
                valign: 'top'
            });

            // 9. Add Potensi Bahaya Value
            // Position: offsetX: 800px, offsetY: 205px, width: 430px, height: 158px
            // Convert: x=6.25", y=1.60", w=3.36", h=1.23"
            slide.addText(kytData.potensi, {
                x: 6.25,
                y: 1.70,
                w: 3.36,
                h: 1.5,
                fontSize: 15,
                bold: false,
                color: '000000',
                align: 'left',
                valign: 'top',
                wrap: true,
                bullet: true
            });

            // 10. Add "PENANGANAN :" Label
            // Position: offsetX: 800px, offsetY: 380px, width: 430px, height: 35px
            // Convert: x=6.25", y=2.97", w=3.36", h=0.27"
            slide.addText('PENANGANAN :', {
                x: 6.25,
                y: 3.12,
                w: 3.36,
                h: 0.35,
                fontSize: 18,
                bold: true,
                color: 'FF0000',
                align: 'left',
                valign: 'top'
            });

            // 11. Add Penanganan Value
            // Position: offsetX: 800px, offsetY: 405px, width: 430px, height: 202px
            // Convert: x=6.25", y=3.16", w=3.36", h=1.58"
            slide.addText(kytData.penanganan, {
                x: 6.25,
                y: 3.35,
                w: 3.36,
                h: 1.7,
                fontSize: 15,
                bold: false,
                color: '000000',
                align: 'left',
                valign: 'top',
                wrap: true,
                bullet: true
            });

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
<!--            <Card.Root class="shadow-xl w-80 p-4">-->
<!--                <Card.Title class="font-bold text-primary">KYT Search</Card.Title>-->
<!--                <div class="w-80 grid grid-cols-2 gap-x-25">-->
<!--                    <Input class="rounded-t-md w-50"/>-->
<!--                    <Button class="w-20">Apply</Button>-->
<!--                </div>-->
<!--            </Card.Root>-->

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

    <!-- View KYT Dialog -->
    <Dialog.Root bind:open={isViewDialogOpen} >
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
                        Submitted by {selectedKyt.user_name}
                    {/if}
                </Dialog.Description>
            </Dialog.Header>

            {#if selectedKyt}
                <div class="space-y-6 py-4">
                    <!-- KYT Result Image -->
                    <div class="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                        <img
                            src={assetUrl(selectedKyt.result_path)}
                            alt={selectedKyt.title}
                            class="w-full h-auto object-contain"
                        />
                    </div>

                    <!-- KYT Information Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Title -->
                        <div class="space-y-2 md:col-span-2">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Title</div>
                            <div class="text-lg font-bold text-gray-900">{selectedKyt.title}</div>
                        </div>

                        <!-- Submitted By -->
                        <div class="space-y-2">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Submitted By</div>
                            <div class="text-base font-medium text-gray-900">{selectedKyt.user_name}</div>
                        </div>

                        <!-- Status -->
                        <div class="space-y-2">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Status</div>
                            <Badge variant="default" class="bg-green-500 text-white">Submitted</Badge>
                        </div>

                        <!-- Potensi -->
                        <div class="space-y-2 md:col-span-2">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Potensi Bahaya</div>
                            <div class="text-base text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                                {selectedKyt.potensi}
                            </div>
                        </div>

                        <!-- Penanganan -->
                        <div class="space-y-2 md:col-span-2">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Penanganan</div>
                            <div class="text-base text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                                {selectedKyt.penanganan}
                            </div>
                        </div>

                        <!-- Submitted Date -->
                        <div class="space-y-2">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Submitted Date</div>
                            <div class="text-base text-gray-700">
                                {new Date(selectedKyt.created_at).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>

                        <!-- Team -->
                        {#if team}
                            <div class="space-y-2">
                                <div class="text-sm font-semibold text-gray-500 uppercase">Team</div>
                                <div class="text-base font-medium text-pink-600">{team.team_name}</div>
                            </div>
                        {/if}
                    </div>

                    <!-- Original Photo (if exists) -->
                    {#if selectedKyt.foto_path}
                        <div class="space-y-3">
                            <div class="text-sm font-semibold text-gray-500 uppercase">Original Photo</div>
                            <div class="rounded-lg overflow-hidden shadow-md bg-gray-100">
                                <img
                                    src={assetUrl(selectedKyt.foto_path)}
                                    alt="Original KYT"
                                    class="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    {/if}

                    <!-- Action Buttons -->
                    <div class="flex justify-between items-center gap-3 pt-4 border-t">
                        <div class="flex gap-2">
                            <Button
                                variant="outline"
                                onclick={() => downloadAsImage(selectedKyt)}
                                class="flex items-center gap-2 bg-blue-50 hover:bg-blue-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                                Download Image
                            </Button>
                            <Button
                                variant="outline"
                                onclick={() => downloadAsPPT(selectedKyt)}
                                class="flex items-center gap-2 bg-orange-50 hover:bg-orange-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                                Download PPT
                            </Button>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                variant="outline"
                                onclick={() => isViewDialogOpen = false}
                            >
                                Close
                            </Button>
                            <Button
                                variant="destructive"
                                onclick={() => {
                                    deleteKyt(selectedKyt.id);
                                    isViewDialogOpen = false;
                                }}
                                class="flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                Delete KYT
                            </Button>
                        </div>
                    </div>
                </div>
            {/if}
        </Dialog.Content>
    </Dialog.Root>
</LeaderLayout>
