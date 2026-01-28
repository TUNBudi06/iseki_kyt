<script>
    import { cn } from "$shadcn/utils";

    let { class:className = "",title='The GodFather',desc='' } = $props();

</script>

<div class={cn("px-2 text-gray-100 sm:px-4 py-0 sm:pb-3 text-left", className)}>
    <h3 class="text-lg font-bold tracking-tighter mt-3 mb-1">
        {title}
    </h3>
    <p class="text-sm leading-5">{desc}</p>
</div>
