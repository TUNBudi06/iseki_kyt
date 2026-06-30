import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h, type DefineComponent } from 'vue'
import './bootstrap'
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init'

const pages = import.meta.glob<{ default: DefineComponent }>('./Pages/**/*.vue')

createInertiaApp({
    resolve: (name) => {
        const mod = pages[`./Pages/${name}.vue`]
        if (!mod) {
            throw new Error(`Page not found: ${name}`)
        }
        return mod()
    },
    setup({ el, App, props, plugin }) {
        initRouteHelper(props)
        const app = createApp({ render: () => h(App, props) })
        app.use(plugin).mount(el)
    },
})
