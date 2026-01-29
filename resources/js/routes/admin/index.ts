import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import user from './user'
import kyt from './kyt'
import team from './team'
/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:15
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
 * @see app/Http/Controllers/AdminController.php:15
 * @route '/admin/home'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:15
 * @route '/admin/home'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::home
 * @see app/Http/Controllers/AdminController.php:15
 * @route '/admin/home'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})
const admin = {
    home: Object.assign(home, home),
user: Object.assign(user, user),
kyt: Object.assign(kyt, kyt),
team: Object.assign(team, team),
}

export default admin