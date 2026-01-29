<script>
    import '../../css/app.css';
    let {children} = $props();
    import {Toaster} from "$shadcn/components/ui/sonner/index.ts";
</script>

<Toaster position="top-right" richColors/>

{@render children?.()}



