<script>
    import '../../css/app.css';
    let {children} = $props();
    import {Toaster} from "$shadcn/components/ui/sonner/index.ts";
    import {Provider} from "$shadcn/components/ui/tooltip/index.ts";
</script>

<Toaster position="top-right" richColors/>

<Provider>
    {@render children?.()}
</Provider>




