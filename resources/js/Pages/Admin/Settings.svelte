<script lang="ts">
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import { Input } from "$shadcn/components/ui/input/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import * as Field from "$shadcn/components/ui/field/index.js";
    import { toast } from "svelte-sonner";
    import { page, useForm } from "@inertiajs/svelte";
    import { changePassword } from "$/routes/admin/settings";
    import { route } from "$/lib/route-helper";

    const form = useForm({
        new_password: '',
        new_password_confirmation: '',
    });

    // Watch for flash messages
    $effect(() => {
        if ($page.props.flash?.success) {
            toast.success($page.props.flash.success);
        }
    });

    function handleSubmit(e: Event) {
        e.preventDefault();

        $form.submit(route(changePassword()), {
            onSuccess: () => {
                toast.success('Password changed successfully!', {
                    id: 'change-password-success',
                });
                $form.reset();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                toast.error(firstError, {
                    id: 'change-password-error',
                });
            }
        });
    }

    function handleCancel() {
        $form.reset();
    }
</script>

<AdminLayout>
    <div class="container mx-auto px-4 py-8 max-w-2xl">
        <div class="mb-6">
            <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
            <p class="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <Card.Root class="border-2">
            <Card.Header>
                <Card.Title class="text-2xl">Change Password</Card.Title>
                <Card.Description>Update your password to keep your account secure</Card.Description>
            </Card.Header>
            <Card.Content>
                <form onsubmit={handleSubmit}>
                    <Field.Set>
                        <Field.Group>
                            <!-- New Password -->
                            <Field.Field>
                                <Field.Label for="new_password">New Password</Field.Label>
                                <Field.Description>
                                    Password must be at least 8 characters long.
                                </Field.Description>
                                <Input
                                    id="new_password"
                                    type="password"
                                    bind:value={$form.new_password}
                                    placeholder="Enter your new password"
                                    disabled={$form.processing}
                                />
                                <Field.Error>{$form.errors.new_password}</Field.Error>
                            </Field.Field>

                            <!-- Confirm New Password -->
                            <Field.Field>
                                <Field.Label for="new_password_confirmation">Confirm New Password</Field.Label>
                                <Field.Description>
                                    Re-enter your new password to confirm.
                                </Field.Description>
                                <Input
                                    id="new_password_confirmation"
                                    type="password"
                                    bind:value={$form.new_password_confirmation}
                                    placeholder="Confirm your new password"
                                    disabled={$form.processing}
                                />
                                <Field.Error>{$form.errors.new_password_confirmation}</Field.Error>
                            </Field.Field>
                        </Field.Group>
                    </Field.Set>

                    <!-- Submit Button -->
                    <div class="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onclick={handleCancel}
                            disabled={$form.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={$form.processing}
                            class="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                            {$form.processing ? "Changing..." : "Change Password"}
                        </Button>
                    </div>
                </form>
            </Card.Content>
        </Card.Root>
    </div>
</AdminLayout>
