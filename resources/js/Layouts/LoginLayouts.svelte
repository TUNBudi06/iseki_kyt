<script lang="ts">
    import DefaultLayouts from "$/Layouts/DefaultLayouts.svelte";
    let {children} = $props();
</script>
<DefaultLayouts>
    <div class="flex h-screen w-full items-center justify-center px-4">
        {@render children?.()}
    </div>
</DefaultLayouts>
