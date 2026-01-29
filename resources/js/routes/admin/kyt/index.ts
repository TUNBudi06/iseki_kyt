import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/kyt/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/admin/kyt/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/kyt/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/kyt/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/kyt/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})
const kyt = {
    list: Object.assign(list, list),
}

export default kyt