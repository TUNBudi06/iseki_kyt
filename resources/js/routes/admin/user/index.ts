import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:56
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
 * @see app/Http/Controllers/AdminController.php:56
 * @route '/admin/user/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:56
 * @route '/admin/user/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::list
 * @see app/Http/Controllers/AdminController.php:56
 * @route '/admin/user/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::add
 * @see app/Http/Controllers/AdminController.php:65
 * @route '/admin/user/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/admin/user/add',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::add
 * @see app/Http/Controllers/AdminController.php:65
 * @route '/admin/user/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::add
 * @see app/Http/Controllers/AdminController.php:65
 * @route '/admin/user/add'
 */
add.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::edit
 * @see app/Http/Controllers/AdminController.php:82
 * @route '/admin/user/edit/{id}'
 */
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: edit.url(args, options),
    method: 'put',
})

edit.definition = {
    methods: ["put"],
    url: '/admin/user/edit/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::edit
 * @see app/Http/Controllers/AdminController.php:82
 * @route '/admin/user/edit/{id}'
 */
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::edit
 * @see app/Http/Controllers/AdminController.php:82
 * @route '/admin/user/edit/{id}'
 */
edit.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: edit.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:102
 * @route '/admin/user/delete/{id}'
 */
export const deleteMethod = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/user/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:102
 * @route '/admin/user/delete/{id}'
 */
deleteMethod.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return deleteMethod.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:102
 * @route '/admin/user/delete/{id}'
 */
deleteMethod.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})
const user = {
    list: Object.assign(list, list),
add: Object.assign(add, add),
edit: Object.assign(edit, edit),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default user