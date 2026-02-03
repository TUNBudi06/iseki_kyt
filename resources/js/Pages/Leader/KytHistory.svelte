<script>
    import {Input} from "$shadcn/components/ui/input/index.ts";
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.ts";
    import {Datatable, TableHandler, ThFilter, ThSort} from "@vincjo/datatables";
    import {Button} from "$shadcn/components/ui/button/index.ts";
    import * as Table from "$shadcn/components/ui/table/index.ts";
    import {Badge} from "$shadcn/components/ui/badge/index.ts";
    import leader from "$routes/leader/index.ts";
    import {routeUrl} from "@tunbudi06/inertia-route-helper";
    import {inertia as InertiaLink} from "@inertiajs/svelte";

    let {kytListDates, team} = $props();

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
                weeks: "Minggu Ke " + dateList.number_of_Weeks,
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
                                            <Button variant="outline" size="sm">View</Button>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        {:else}
                                            <a use:InertiaLink href={routeUrl(leader.kytadd({IdKytDate: row.id}))}>
                                                <Button size="sm">Tambahkan KYT</Button>
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
</LeaderLayout>
