<script lang="ts">
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import { Input } from "$shadcn/components/ui/input/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Field from "$shadcn/components/ui/field/index.js";
    import { toast } from "svelte-sonner";
    import { page, useForm } from "@inertiajs/svelte";

    const form = useForm({
        new_password: '',
        new_password_confirmation: '',
    });

    // Watch for flash messages
    $effect(() => {
        if ($page.props.flash?.success) {
            toast.success($page.props.flash.success);
        }
        if ($page.props.flash?.error) {
            toast.error($page.props.flash.error);
        }
    });

    function handleSubmit(e: Event) {
        e.preventDefault();

        $form.post('/admin/settings/change-password', {
            onSuccess: () => {
                toast.success('Password changed successfully!');
                $form.reset();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                toast.error(firstError || 'Failed to change password');
            }
        });
    }

    function handleCancel() {
        $form.reset();
    }
</script>

<svelte:head>
    <title>Settings - Admin Panel</title>
    <meta name="description" content="Admin settings page for managing account" />
</svelte:head>

<AdminLayout>
    <div class="space-y-4 md:space-y-6 px-2 sm:px-0">
        <!-- Page Header - Gradient Style matching Dashboard -->
        <div class="bg-linear-to-r from-pink-500 to-pink-600 rounded-lg p-6 md:p-8 text-white">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Settings</h1>
            <p class="text-pink-100 text-sm md:text-base">
                Manage your account settings and preferences
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <!-- Change Password Card - Takes 2 columns -->
            <div class="lg:col-span-2">
                <Card.Root class="border-2 border-pink-200">
                    <Card.Header class="bg-linear-to-r from-pink-50 to-blue-50 p-4 md:p-6">
                        <Card.Title class="text-xl sm:text-2xl font-bold text-pink-600">
                            Change Password
                        </Card.Title>
                        <Card.Description class="text-sm md:text-base mt-1">
                            Update your password to keep your account secure
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="p-4 md:p-6">
                        <form onsubmit={handleSubmit}>
                            <Field.Set>
                                <Field.Group>
                                    <!-- New Password -->
                                    <Field.Field>
                                        <Field.Label for="new_password" class="text-base font-semibold">
                                            New Password
                                        </Field.Label>
                                        <Field.Description class="text-sm">
                                            Password must be at least 8 characters long.
                                        </Field.Description>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            bind:value={$form.new_password}
                                            placeholder="Enter your new password"
                                            disabled={$form.processing}
                                            class="h-11 text-base"
                                        />
                                        <Field.Error>{$form.errors.new_password}</Field.Error>
                                    </Field.Field>

                                    <!-- Confirm New Password -->
                                    <Field.Field>
                                        <Field.Label for="new_password_confirmation" class="text-base font-semibold">
                                            Confirm New Password
                                        </Field.Label>
                                        <Field.Description class="text-sm">
                                            Re-enter your new password to confirm.
                                        </Field.Description>
                                        <Input
                                            id="new_password_confirmation"
                                            type="password"
                                            bind:value={$form.new_password_confirmation}
                                            placeholder="Confirm your new password"
                                            disabled={$form.processing}
                                            class="h-11 text-base"
                                        />
                                        <Field.Error>{$form.errors.new_password_confirmation}</Field.Error>
                                    </Field.Field>
                                </Field.Group>
                            </Field.Set>

                            <!-- Submit Button -->
                            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onclick={handleCancel}
                                    disabled={$form.processing}
                                    class="h-11 text-base"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={$form.processing}
                                    class="bg-pink-600 hover:bg-pink-700 text-white h-11 text-base font-semibold"
                                >
                                    {#if $form.processing}
                                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Changing...
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                        </svg>
                                        Change Password
                                    {/if}
                                </Button>
                            </div>
                        </form>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Account Information Card - Takes 1 column -->
            <div class="lg:col-span-1">
                <Card.Root class="border-2 border-gray-200 h-full">
                    <Card.Header class="bg-gray-50 p-4 md:p-6">
                        <Card.Title class="text-lg sm:text-xl font-bold text-gray-800">
                            Account Information
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Your current account details
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="p-4 md:p-6">
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1 py-3 border-b">
                                <span class="text-sm font-semibold text-gray-600">Username</span>
                                <span class="text-base text-gray-900 font-medium">{$page.props.auth?.user?.username || '-'}</span>
                            </div>
                            <div class="flex flex-col gap-1 py-3 border-b">
                                <span class="text-sm font-semibold text-gray-600">Role</span>
                                <span class="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-pink-100 text-pink-800">
                                    {$page.props.auth?.user?.role || '-'}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1 py-3">
                                <span class="text-sm font-semibold text-gray-600">Status</span>
                                <span class="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    Active
                                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    </div>
</AdminLayout>
