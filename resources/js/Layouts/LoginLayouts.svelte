<script lang="ts">
    import DefaultLayouts from "$/Layouts/DefaultLayouts.svelte";
    let {children} = $props();

</script>
<svelte:head>
    <title>Iseki KYT | Login</title>
    <meta name="description" content="Login to Your Account to produce kyt" />
</svelte:head>

<DefaultLayouts>
    <div class="min-h-screen flex items-center justify-center px-4">
        {@render children?.()}
    </div>
</DefaultLayouts>
