import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'
import './bootstrap'
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init'

createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.vue')
        const page = pages[`./Pages/${name}.vue`]
        if (!page) {
            throw new Error(`Page not found: ${name}`)
        }
        return page;
    },
    setup({ el, App, props, plugin }) {
        initRouteHelper(props)
        const app = createApp({ render: () => h(App, props) })
        app.use(plugin).mount(el)
    },
})
