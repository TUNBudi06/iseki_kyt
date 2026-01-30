import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import user from './user'
import kyt from './kyt'
import team from './team'
import settings69f00b from './settings'
/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/admin/home',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:202
 * @route '/admin/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:202
 * @route '/admin/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:202
 * @route '/admin/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:202
 * @route '/admin/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})
const admin = {
    home: Object.assign(home, home),
user: Object.assign(user, user),
kyt: Object.assign(kyt, kyt),
team: Object.assign(team, team),
settings: Object.assign(settings, settings69f00b),
}

export default admin