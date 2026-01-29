import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:24
 * @route '/admin/user/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/admin/user/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:24
 * @route '/admin/user/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:24
 * @route '/admin/user/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:24
 * @route '/admin/user/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})
const user = {
    list: Object.assign(list, list),
}

export default user