import { createInertiaApp, type ResolvedComponent } from '@inertiajs/svelte';
import { hydrate, mount } from 'svelte';
import './bootstrap';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob<ResolvedComponent>('./Pages/**/*.svelte');
        return pages[`./Pages/${name}.svelte`]();
    },
    setup({ el, App, props }) {
        if (el && el.dataset.serverRendered === 'true') {
            hydrate(App, { target: el, props });
        } else if (el) {
            mount(App, { target: el, props });
        }
    },
});
