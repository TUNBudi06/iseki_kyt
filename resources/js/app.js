import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'
import './bootstrap'
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init'

const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })

createInertiaApp({
    resolve: (name) => {
        const page = pages[`./Pages/${name}.vue`]
        if (!page) {
            console.error(`Page not found: ./Pages/${name}.vue`)
            console.log('Available pages:', Object.keys(pages))
        }
        return page
    },
    setup({ el, App, props, plugin }) {
        initRouteHelper(props)
        const app = createApp({ render: () => h(App, props) })
        app.use(plugin)
        app.mount(el)
    },
})
