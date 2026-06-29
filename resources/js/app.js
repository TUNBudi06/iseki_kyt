import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'
import './bootstrap'
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init'

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.vue')
        return pages[`./Pages/${name}.vue`]()
    },
    setup({ el, App, props, plugin }) {
        initRouteHelper(props)
        const app = createApp({ render: () => h(App, props) })
        app.use(plugin)
        app.mount(el)
    },
})
