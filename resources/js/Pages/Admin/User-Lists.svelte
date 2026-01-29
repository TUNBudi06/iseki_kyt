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
    import { add as addUser, edit as editUser, deleteMethod as deleteUser } from "\$/routes/admin/user";
    import { list as teamList } from "\$/routes/admin/team";
    import {route} from "$/lib/route-helper";
    import {toast} from "svelte-sonner";
    let {users} = $props();

    const form = useForm({
        username: '',
        password: '',
        role: 'leader',
    });

    const editForm = useForm({
        username: '',
        password: '',
        role: 'leader',
    });

    let editingUserId = $state<number | null>(null);
    let deletingUserId = $state<number | null>(null);

    function submitButton(e: Event) {
        e.preventDefault();
        $form.submit(route(addUser()),{
            onSuccess: () => {
                open = false;
                $form.reset();
                toast.success('User berhasil ditambahkan',{
                    id: 'add-user-success',
                });
                router.reload({only:['users']})
            }
        });
    }

    function submitEditButton(e: Event) {
        e.preventDefault();
        if (editingUserId === null) return;

        $editForm.submit(route(editUser(editingUserId)), {
            method: 'put',
            onSuccess: () => {
                openEdit = false;
                editingUserId = null;
                $editForm.reset();
                toast.success('User berhasil diupdate', {
                    id: 'edit-user-success',
                });
                router.reload({only:['users']})
            }
        });
    }

    function confirmDelete() {
        if (deletingUserId === null) return;

        router.delete(route(deleteUser(deletingUserId)), {
            onSuccess: () => {
                openDelete = false;
                deletingUserId = null;
                toast.success('User berhasil dihapus', {
                    id: 'delete-user-success',
                });
                router.reload({only:['users']})
            }
        });
    }

    function openEditDialog(user: any) {
        editingUserId = user.id;
        $editForm.username = user.username;
        $editForm.password = '';
        $editForm.role = user.role;
        openEdit = true;
    }

    function openDeleteDialog(userId: number) {
        deletingUserId = userId;
        openDelete = true;
    }

    let open = $state(false);
    let openEdit = $state(false);
    let openDelete = $state(false);

    const table = new TableHandler(users, {
        rowsPerPage: 10,
        i18n: {
            search: 'Cari User...',
            noRows: 'User tidak ditemukan',
            show: 'Tunjukkan',
            entries: 'entries',
            previous: 'Previous',
            next: 'Next',
        },
        highlight:true,
    })

    $effect(() => {
        table.setRows(users);
    })

    const admin = [
        {value: 'admin', label: 'Admin'},
        {value: 'leader', label: 'Leader'},
    ]

    const adminLabel = $derived(admin.find(item => item.value === $form.role)?.label ?? 'User');
    const adminEditLabel = $derived(admin.find(item => item.value === $editForm.role)?.label ?? 'User');

    $inspect($form.errors)
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
                    <Link href={route(teamList())}>
                        <Button class="transform-3d hover:scale-105">Manage Teams</Button>
                    </Link>
                </div>
            </div>
        </Card.Header>

        <Card.Content>
            <Button onclick={()=> open = !open} class="cursor-pointer">
                Tambah User
            </Button>

            <Datatable basic {table}>
                <div class="mt-4 rounded-lg overflow-hidden">
                    <Table.Root class="w-full" data-table-bordered>
                        <Table.Header class="bg-linear-to-r from-pink-500 to-pink-600 text-pink-400">
                            <Table.Row class="hover:bg-transparent">
                                <th class="px-6 py-4 text-left font-semibold">
                                    <ThSort {table} field="id">ID</ThSort>
                                </th>
                                <th class="px-6 py-4 text-left font-semibold">
                                    <ThSort {table} field="username">UserName</ThSort>
                                </th>
                                <th class="px-6 py-4 text-left font-semibold">
                                    <ThSort {table} field="role">Role</ThSort>
                                </th>
                                <Table.Head class="px-6 py-4 text-left font-semibold text-white">
                                    Actions
                                </Table.Head>
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
                                <Table.Head class="px-6 py-3">
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as row}
                                {@const index = row.id}
                                <Table.Row
                                    class={index % 2 === 0 ? 'bg-pink-50 text-pink-900 hover:bg-pink-100' : 'bg-pink-300 text-pink-900 hover:bg-pink-400'}>
                                    <Table.Cell class="px-6 py-4">
                                        {index}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4">
                                        {@html row.username}
                                    </Table.Cell>
                                    <Table.Cell class="px-6 py-4">
                                        {row.role}
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
    <Dialog.Root bind:open={open}>
        <Dialog.Content>
            <form>
                <Dialog.Header>
                    <Dialog.Title>Tambahkan User login</Dialog.Title>
                    <Dialog.Description>
                        Isi form dibawah untuk menambahkan user baru.
                    </Dialog.Description>
                </Dialog.Header>
                <Field.Set>
                    <Field.Group>
                        <Field.Field>
                            <Field.Label for="username">Username</Field.Label>
                            <Input id="username" bind:value={$form.username} type="text" placeholder="Max Leiter" />
                            <Field.Error>{$form.errors.username}</Field.Error>
                            <Field.Description
                            >Choose a unique username for your account.</Field.Description
                            >
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="password">Password</Field.Label>
                            <Field.Description
                            >Must be at least 8 characters long.</Field.Description
                            >
                            <Input id="password" bind:value={$form.password} placeholder="••••••••" />
                            <Field.Error>{$form.errors.password}</Field.Error>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="role">User Type</Field.Label>
                            <Select.Root type="single" bind:value={$form.role} >
                                <Select.Trigger id="role">
                                    {adminLabel}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each admin as a (a.value)}
                                        <Select.Item {...a} />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                            <Field.Description
                            >Select your department or area of work.</Field.Description
                            >
                        </Field.Field>
                        <Button disabled={$form.processing} class="mt-4 w-full" onclick={submitButton}>
                            Tambah User
                        </Button>
                    </Field.Group>
                </Field.Set>
            </form>
        </Dialog.Content>
    </Dialog.Root>

    <!-- Edit User Dialog -->
    <Dialog.Root bind:open={openEdit}>
        <Dialog.Content>
            <form>
                <Dialog.Header>
                    <Dialog.Title>Edit User</Dialog.Title>
                    <Dialog.Description>
                        Update informasi user. Kosongkan password jika tidak ingin mengubahnya.
                    </Dialog.Description>
                </Dialog.Header>
                <Field.Set>
                    <Field.Group>
                        <Field.Field>
                            <Field.Label for="edit-username">Username</Field.Label>
                            <Input id="edit-username" bind:value={$editForm.username} type="text" placeholder="Max Leiter" />
                            <Field.Error>{$editForm.errors.username}</Field.Error>
                            <Field.Description>Choose a unique username for your account.</Field.Description>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="edit-password">Password</Field.Label>
                            <Field.Description>Kosongkan jika tidak ingin mengubah password. Minimum 8 karakter.</Field.Description>
                            <Input id="edit-password" bind:value={$editForm.password} placeholder="••••••••" />
                            <Field.Error>{$editForm.errors.password}</Field.Error>
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="edit-role">User Type</Field.Label>
                            <Select.Root type="single" bind:value={$editForm.role}>
                                <Select.Trigger id="edit-role">
                                    {adminEditLabel}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each admin as a (a.value)}
                                        <Select.Item {...a} />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                            <Field.Description>Select your department or area of work.</Field.Description>
                        </Field.Field>
                        <div class="flex gap-2 mt-4">
                            <Button disabled={$editForm.processing} class="flex-1" onclick={submitEditButton}>
                                Update User
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
                    Tindakan ini tidak dapat dibatalkan. User ini akan dihapus secara permanen dari database.
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
                    Hapus User
                </Button>
            </div>
        </Dialog.Content>
    </Dialog.Root>
</AdminLayout>

