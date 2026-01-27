<script lang="ts">
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import {useForm} from "@inertiajs/svelte"
    import {login} from "$routes";
    import {route} from "$/lib/route-helper";
    import { Input } from "$shadcn/components/ui/input/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel,
        FieldError,
    } from "$shadcn/components/ui/field/index.js";
    import LoginLayouts from "$/Layouts/LoginLayouts.svelte";
    let form = useForm({
        username: '',
        password: '',
    }).dontRemember('password');

    function onsubmit(e: Event) {
        e.preventDefault();
        $form.submit(route(login()),{
            onSuccess: (e) => {
                console.log('Login successful', e);
            },
        });
    }
</script>

<LoginLayouts>
    <Card.Root class="mx-auto w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">Login</Card.Title>
            <Card.Description>Enter your username below to login to your account</Card.Description>
        </Card.Header>
        <Card.Content>
            <form {onsubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel for="email">Username</FieldLabel>
                        <Input id="username" bind:value={$form.username} type="text" placeholder="johndoe" required />
                        {#if $form.hasErrors}
                            <FieldError>{$form.errors.username}</FieldError>
                        {/if}
                    </Field>
                    <Field>
                        <div class="flex items-center">
                            <FieldLabel for="password">Password</FieldLabel>
                        </div>
                        <Input id="password" bind:value={$form.password} type="password" required />
                    </Field>
                    <Field>
                        <Button type="submit" class="w-full">Login</Button>
                    </Field>
                </FieldGroup>
            </form>
        </Card.Content>
    </Card.Root>
</LoginLayouts>
