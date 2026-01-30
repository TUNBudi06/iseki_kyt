<script lang="ts">
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import {TableHandler} from "@vincjo/datatables";
    import * as Table from "$shadcn/components/ui/table/index.js";
    import * as Field from "$shadcn/components/ui/field/index.js";
    import {onMount} from "svelte";
    import {Input} from "$shadcn/components/ui/input/index.ts";
    let {kytLists} = $props();


    const table = new TableHandler(kytLists,{
        highlight: true
    });

    $effect(() => {
        table.setRows(kytLists);
    });

    const searchTableGlobal = table.createSearch()
    $inspect(table.rows)
</script>

<AdminLayout>
    <Card.Root>
        <Card.Header class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
            <div class="flex justify-between w-full items-center">
                <div>
                    <Card.Title class="text-2xl font-bold text-white">KYT Lists</Card.Title>
                    <Card.Description class="text-pink-50">Manage and view all KYT.</Card.Description>
                </div>
                <div>
                </div>
            </div>
        </Card.Header>
        <Card.Content>
            <div class="w-full pt-5 pb-2">
                <Field.Group class="w-68 p-2 border-2 border-gray-200 rounded-md">
                    <Field.Field>
                        <Field.Label>Search KYT: </Field.Label>
                        <Input type="text" class="ps-4" bind:value={searchTableGlobal.value} oninput={()=>searchTableGlobal.set()} placeholder="Search all Here....." />
                    </Field.Field>
                </Field.Group>
            </div>
            <Table.Root>
                <Table.Caption>A list of your recent invoices.</Table.Caption>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-[10px]">No</Table.Head>
                        <Table.Head>Minggu</Table.Head>
                        <Table.Head>Tanggal Terakhir</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell class="font-medium">INV001</Table.Cell>
                        <Table.Cell>Paid</Table.Cell>
                        <Table.Cell>Credit Card</Table.Cell>
                        <Table.Cell class="text-end">$250.00</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>
</AdminLayout>
