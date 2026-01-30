<script lang="ts">
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Table from "$shadcn/components/ui/table/index.js";
    import {Button} from "$shadcn/components/ui/button/index.ts";
    import {router, useForm, Link} from "@inertiajs/svelte";
    import { TableHandler, Datatable, ThSort, ThFilter } from '@vincjo/datatables'
    import * as Dialog from "$shadcn/components/ui/dialog/index.js";
    import {Input} from "$shadcn/components/ui/input/index.js";
    import * as Field from "$shadcn/components/ui/field/index.js";
    import * as Select from "$shadcn/components/ui/select/index.js";
    import { add as addTeam, edit as editTeam, deleteMethod as deleteTeam } from "\$/routes/admin/team";
    import { list as userList } from "\$/routes/admin/user";
    import {route, routeUrl} from "@tunbudi06/inertia-route-helper";
    import {toast} from "svelte-sonner";

    let {teams, users} = $props();

    const table = new TableHandler(teams, {
        rowsPerPage: 10,
        i18n: {
            search: 'Cari Team...',
            noData: 'Team tidak ditemukan',
            showing: 'Tunjukkan',
            to: 'sampai',
            of: 'dari',
            entries: 'entries',
            previous: 'Previous',
            next: 'Next',
        },
        highlight:true,
    })

    $effect(() => {
        table.setRows(teams);
    })

    const form = useForm({
        team_name: '',
        team_description: '',
        user_id: '',
    });

    const editForm = useForm({
        team_name: '',
        team_description: '',
        user_id: '',
    });

    let editingTeamId = $state<number | null>(null);
    let deletingTeamId = $state<number | null>(null);

    function submitButton(e: Event) {
        e.preventDefault();
        $form.post(route(addTeam()).url, {
            onSuccess: () => {
                open = false;
                $form.reset();
                toast.success('Team berhasil ditambahkan',{
                    id: 'add-team-success',
                });
                router.reload({only:['teams']})
            }
        });
    }

    function submitEditButton(e: Event) {
        e.preventDefault();
        if (editingTeamId === null) return;

        $editForm.put(route(editTeam(editingTeamId)).url, {
            onSuccess: () => {
                openEdit = false;
                editingTeamId = null;
                $editForm.reset();
                toast.success('Team berhasil diupdate', {
                    id: 'edit-team-success',
                });
                router.reload({only:['teams']})
            }
        });
    }

    function confirmDelete() {
        if (deletingTeamId === null) return;

        router.delete(route(deleteTeam(deletingTeamId)).url, {
            onSuccess: () => {
                openDelete = false;
                deletingTeamId = null;
                toast.success('Team berhasil dihapus', {
                    id: 'delete-team-success',
                });
                router.reload({only:['teams']})
            }
        });
    }

    function openEditDialog(team: any) {
        editingTeamId = team.id;
        $editForm.team_name = team.team_name;
        $editForm.team_description = team.team_description || '';
        $editForm.user_id = team.user_id || '';
        openEdit = true;
    }

    function openDeleteDialog(teamId: number) {
        deletingTeamId = teamId;
        openDelete = true;
    }

    let open = $state(false);
    let openEdit = $state(false);
    let openDelete = $state(false);

    // Transform users untuk Select component
    const userOptions = users.map((u: any) => ({
        value: u.id.toString(),
        label: u.username,
    }));

    const selectedPicLabel = $derived(
        userOptions.find(item => item.value === $form.user_id)?.label ?? 'Select PIC'
    );

    const selectedEditPicLabel = $derived(
        userOptions.find(item => item.value === $editForm.user_id)?.label ?? 'Select PIC'
    );

    $inspect($form.errors)
</script>

<svelte:head>
    <title>Team Lists - Admin Panel</title>
    <meta name="description" content="Admin panel for managing teams." />
</svelte:head>

<AdminLayout>
    <Card.Root class="shadow-xl">
        <Card.Header class="bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 text-white rounded-t-lg p-6">
            <div class="flex justify-between w-full items-center">
                <div>
                    <Card.Title class="text-2xl font-bold text-white">Team Lists</Card.Title>
                    <Card.Description class="text-pink-50">Manage and view all teams.</Card.Description>
                </div>
                <div>
                    <Link href={routeUrl(userList())}>
                        <Button class="bg-white text-pink-600 hover:bg-pink-50 font-semibold shadow-lg transform hover:scale-105 transition-all">
                            Manage Users
                        </Button>
                    </Link>
                </div>
            </div>
        </Card.Header>

        <Card.Content class="p-6">
            <Button onclick={() => open = !open} class="bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer">
                + Tambah Team
            </Button>

            <Datatable basic {table}>
                <div class="mt-4 rounded-lg overflow-hidden shadow-lg">
                    <Table.Root class="w-full" data-table-bordered>
                        <Table.Header class="bg-linear-to-r from-pink-500 to-pink-600 text-black">
                            <Table.Row class="hover:bg-transparent">
                                <th class="px-6 py-4 text-left font-semibold ">
                                    <ThSort {table} field="id">No</ThSort>
                                </th>
                                <th class="px-6 py-4 text-left font-semibold ">
                                    <ThSort {table} field="team_name">Name</ThSort>
                                </th>
                                <th class="px-6 py-4 text-left font-semibold ">
                                    <ThSort {table} field="team_description">Description</ThSort>
                                </th>
                                <th class="px-6 py-4 text-left font-semibold ">
                                    PIC
                                </th>
                                <Table.Head class="px-6 py-4 text-left font-semibold ">
                                    Actions
                                </Table.Head>
                            </Table.Row>
                            <Table.Row class="bg-pink-200 hover:bg-pink-200">
                                <Table.Head class="px-6 py-3 text-pink-900">
                                    <ThFilter {table} field="id" />
                                </Table.Head>
                                <Table.Head class="px-6 py-3 text-pink-900">
                                    <ThFilter {table} field="team_name" />
                                </Table.Head>
                                <Table.Head class="px-6 py-3 text-pink-900">
                                    <ThFilter {table} field="team_description" />
                                </Table.Head>
                                <Table.Head class="px-6 py-3 text-pink-900">
                                </Table.Head>
                                <Table.Head class="px-6 py-3 text-pink-900">
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as row, idx}
                                <Table.Row
                                    class={idx % 2 === 0 ? 'bg-white hover:bg-pink-50 transition-colors' : 'bg-pink-100 hover:bg-pink-200 transition-colors'}>
                                    <Table.Cell class="px-6 py-4 text-gray-900">
                                        {idx + 1}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4 text-gray-900 font-medium">
                                        {@html row.team_name}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4 text-gray-700">
                                        {row.team_description || '-'}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4">
                                        {#if row.user}
                                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500 text-white">
                                                {row.user.username}
                                            </span>
                                        {:else}
                                            <span class="text-gray-400">No PIC</span>
                                        {/if}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4">
                                        <div class="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                class="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                                                onclick={() => openEditDialog(row)}>
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                class="bg-red-500 hover:bg-red-600 text-white border-red-500"
                                                onclick={() => openDeleteDialog(row.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
            </Datatable>
        </Card.Content>
    </Card.Root>

    <!-- Add Team Dialog -->
    <Dialog.Root bind:open={open}>
        <Dialog.Content>
            <form>
                <Dialog.Header>
                    <Dialog.Title>Tambahkan Team</Dialog.Title>
                    <Dialog.Description>
                        Isi form dibawah untuk menambahkan team baru.
                    </Dialog.Description>
                </Dialog.Header>
                <Field.Set>
                    <Field.Group>
                        <Field.Field>
                            <Field.Label for="team_name">Team Name</Field.Label>
                            <Input id="team_name" bind:value={$form.team_name} type="text" placeholder="DST" />
                            <Field.Error>{$form.errors.team_name}</Field.Error>
                            <Field.Description>Enter a unique team name.</Field.Description>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="team_description">Description</Field.Label>
                            <Field.Description>Brief description of the team (optional).</Field.Description>
                            <Input id="team_description" bind:value={$form.team_description} placeholder="Team description..." />
                            <Field.Error>{$form.errors.team_description}</Field.Error>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="user_id">PIC (Person In Charge)</Field.Label>
                            <Select.Root type="single" bind:value={$form.user_id}>
                                <Select.Trigger id="user_id">
                                    {selectedPicLabel}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each userOptions as user (user.value)}
                                        <Select.Item {...user} />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                            <Field.Description>Select the person in charge for this team.</Field.Description>
                            <Field.Error>{$form.errors.user_id}</Field.Error>
                        </Field.Field>
                        <Button disabled={$form.processing} class="mt-4 w-full" onclick={submitButton}>
                            Tambah Team
                        </Button>
                    </Field.Group>
                </Field.Set>
            </form>
        </Dialog.Content>
    </Dialog.Root>

    <!-- Edit Team Dialog -->
    <Dialog.Root bind:open={openEdit}>
        <Dialog.Content>
            <form>
                <Dialog.Header>
                    <Dialog.Title>Edit Team</Dialog.Title>
                    <Dialog.Description>
                        Update informasi team.
                    </Dialog.Description>
                </Dialog.Header>
                <Field.Set>
                    <Field.Group>
                        <Field.Field>
                            <Field.Label for="edit-team_name">Team Name</Field.Label>
                            <Input id="edit-team_name" bind:value={$editForm.team_name} type="text" placeholder="DST" />
                            <Field.Error>{$editForm.errors.team_name}</Field.Error>
                            <Field.Description>Enter a unique team name.</Field.Description>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="edit-team_description">Description</Field.Label>
                            <Field.Description>Brief description of the team (optional).</Field.Description>
                            <Input id="edit-team_description" bind:value={$editForm.team_description} placeholder="Team description..." />
                            <Field.Error>{$editForm.errors.team_description}</Field.Error>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="edit-user_id">PIC (Person In Charge)</Field.Label>
                            <Select.Root type="single" bind:value={$editForm.user_id}>
                                <Select.Trigger id="edit-user_id">
                                    {selectedEditPicLabel}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each userOptions as user (user.value)}
                                        <Select.Item {...user} />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                            <Field.Description>Select the person in charge for this team.</Field.Description>
                            <Field.Error>{$editForm.errors.user_id}</Field.Error>
                        </Field.Field>
                        <div class="flex gap-2 mt-4">
                            <Button disabled={$editForm.processing} class="flex-1" onclick={submitEditButton}>
                                Update Team
                            </Button>
                            <Button type="button" variant="outline" class="flex-1" onclick={() => openEdit = false}>
                                Cancel
                            </Button>
                        </div>
                    </Field.Group>
                </Field.Set>
            </form>
        </Dialog.Content>
    </Dialog.Root>

    <!-- Delete Confirmation Dialog -->
    <Dialog.Root bind:open={openDelete}>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title class="text-red-600">Apakah Anda yakin?</Dialog.Title>
                <Dialog.Description>
                    Tindakan ini tidak dapat dibatalkan. Team ini akan dihapus secara permanen dari database.
                </Dialog.Description>
            </Dialog.Header>
            <div class="flex gap-2 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    class="flex-1"
                    onclick={() => openDelete = false}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    class="flex-1 bg-red-500 hover:bg-red-600"
                    onclick={confirmDelete}>
                    Hapus Team
                </Button>
            </div>
        </Dialog.Content>
    </Dialog.Root>
</AdminLayout>
