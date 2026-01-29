<script>
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Table from "$shadcn/components/ui/table/index.js";
    import {Button} from "$shadcn/components/ui/button/index.ts";
    import { TableHandler, Datatable, ThSort, ThFilter } from '@vincjo/datatables'
    let {users} = $props();

    const table = new TableHandler(users, {
        rowsPerPage: 10,
        i18n: {
            search: 'Cari User...',
            noData: 'User tidak ditemukan',
            showing: 'Tunjukkan',
            to: 'sampai',
            of: 'dari',
            entries: 'entries',
            previous: 'Previous',
            next: 'Next',
        },
        highlight:true,
    })
    // $inspect(table);
    console.log(table)
</script>

<svelte:head>
    <title>User Lists - Admin Panel</title>
    <meta name="description" content="Admin panel for managing user lists." />
</svelte:head>

<AdminLayout>
    <Card.Root>
        <Card.Header>
            <div class="flex justify-between w-full">
                <div>
                    <Card.Title>User Lists</Card.Title>
                    <Card.Description>Manage and view all registered users.</Card.Description>
                </div>
                <div>
                    <Button class="transform-3d hover:scale-105">Manage Teams</Button>
                </div>
            </div>
        </Card.Header>

        <Card.Content>
            <Button>
                Tambah User
            </Button>

            <Datatable basic {table}>
                <div class="mt-4 rounded-lg overflow-hidden">
                    <Table.Root class="w-full" data-table-bordered>
                        <Table.Header class="bg-linear-to-r from-pink-500 to-pink-600 text-black">
                            <Table.Row class="hover:bg-transparent">
                                <ThSort {table} field="id" class="px-6 py-4 text-left font-semibold">
                                    ID
                                </ThSort>
                                <ThSort {table} field="username" class="px-6 py-4 text-left font-semibold">
                                    UserName
                                </ThSort>
                                <ThSort {table} field="role" class="px-6 py-4 text-left font-semibold">
                                    Role
                                </ThSort>
                            </Table.Row>
                            <Table.Row class="bg-pink-100 hover:bg-pink-100">
                                <Table.Head class="px-6 py-3">
                                    <ThFilter {table} field="id" />
                                </Table.Head>
                                <Table.Head class="px-6 py-3">
                                    <ThFilter {table} field="username" />
                                </Table.Head>
                                <Table.Head class="px-6 py-3">
                                    <ThFilter {table} field="role" />
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as row}
                                {@const index = row.id}
                                <Table.Row
                                    class={index % 2 === 0 ? 'bg-pink-50 text-pink-900 hover:bg-pink-100' : 'bg-pink-300 text-pink-900 hover:bg-pink-400'}>
                                    <Table.Cell class="px-6 py-4">
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4">
                                        {@html row.username}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4">
                                        {row.role}
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
            </Datatable>
        </Card.Content>
    </Card.Root>
</AdminLayout>
