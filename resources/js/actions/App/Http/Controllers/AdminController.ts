import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/home',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/admin/home'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::userList
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/user/list'
 */
export const userList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userList.url(options),
    method: 'get',
})

userList.definition = {
    methods: ["get","head"],
    url: '/admin/user/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::userList
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/user/list'
 */
userList.url = (options?: RouteQueryOptions) => {
    return userList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::userList
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/user/list'
 */
userList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::userList
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/user/list'
 */
userList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userList.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::userAdd
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/user/add'
 */
export const userAdd = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userAdd.url(options),
    method: 'post',
})

userAdd.definition = {
    methods: ["post"],
    url: '/admin/user/add',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::userAdd
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/user/add'
 */
userAdd.url = (options?: RouteQueryOptions) => {
    return userAdd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::userAdd
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/user/add'
 */
userAdd.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userAdd.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::userEdit
 * @see app/Http/Controllers/AdminController.php:83
 * @route '/admin/user/edit/{id}'
 */
export const userEdit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: userEdit.url(args, options),
    method: 'put',
})

userEdit.definition = {
    methods: ["put"],
    url: '/admin/user/edit/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::userEdit
 * @see app/Http/Controllers/AdminController.php:83
 * @route '/admin/user/edit/{id}'
 */
userEdit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return userEdit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::userEdit
 * @see app/Http/Controllers/AdminController.php:83
 * @route '/admin/user/edit/{id}'
 */
userEdit.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: userEdit.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AdminController::userDelete
 * @see app/Http/Controllers/AdminController.php:103
 * @route '/admin/user/delete/{id}'
 */
export const userDelete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: userDelete.url(args, options),
    method: 'delete',
})

userDelete.definition = {
    methods: ["delete"],
    url: '/admin/user/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::userDelete
 * @see app/Http/Controllers/AdminController.php:103
 * @route '/admin/user/delete/{id}'
 */
userDelete.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return userDelete.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::userDelete
 * @see app/Http/Controllers/AdminController.php:103
 * @route '/admin/user/delete/{id}'
 */
userDelete.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: userDelete.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminController::kytList
 * @see app/Http/Controllers/AdminController.php:159
 * @route '/admin/kyt/list'
 */
export const kytList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytList.url(options),
    method: 'get',
})

kytList.definition = {
    methods: ["get","head"],
    url: '/admin/kyt/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::kytList
 * @see app/Http/Controllers/AdminController.php:159
 * @route '/admin/kyt/list'
 */
kytList.url = (options?: RouteQueryOptions) => {
    return kytList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::kytList
 * @see app/Http/Controllers/AdminController.php:159
 * @route '/admin/kyt/list'
 */
kytList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::kytList
 * @see app/Http/Controllers/AdminController.php:159
 * @route '/admin/kyt/list'
 */
kytList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kytList.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::teamList
 * @see app/Http/Controllers/AdminController.php:112
 * @route '/admin/team/list'
 */
export const teamList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: teamList.url(options),
    method: 'get',
})

teamList.definition = {
    methods: ["get","head"],
    url: '/admin/team/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::teamList
 * @see app/Http/Controllers/AdminController.php:112
 * @route '/admin/team/list'
 */
teamList.url = (options?: RouteQueryOptions) => {
    return teamList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::teamList
 * @see app/Http/Controllers/AdminController.php:112
 * @route '/admin/team/list'
 */
teamList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: teamList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::teamList
 * @see app/Http/Controllers/AdminController.php:112
 * @route '/admin/team/list'
 */
teamList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: teamList.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::teamAdd
 * @see app/Http/Controllers/AdminController.php:123
 * @route '/admin/team/add'
 */
export const teamAdd = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: teamAdd.url(options),
    method: 'post',
})

teamAdd.definition = {
    methods: ["post"],
    url: '/admin/team/add',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::teamAdd
 * @see app/Http/Controllers/AdminController.php:123
 * @route '/admin/team/add'
 */
teamAdd.url = (options?: RouteQueryOptions) => {
    return teamAdd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::teamAdd
 * @see app/Http/Controllers/AdminController.php:123
 * @route '/admin/team/add'
 */
teamAdd.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: teamAdd.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::teamEdit
 * @see app/Http/Controllers/AdminController.php:136
 * @route '/admin/team/edit/{id}'
 */
export const teamEdit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: teamEdit.url(args, options),
    method: 'put',
})

teamEdit.definition = {
    methods: ["put"],
    url: '/admin/team/edit/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::teamEdit
 * @see app/Http/Controllers/AdminController.php:136
 * @route '/admin/team/edit/{id}'
 */
teamEdit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return teamEdit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::teamEdit
 * @see app/Http/Controllers/AdminController.php:136
 * @route '/admin/team/edit/{id}'
 */
teamEdit.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: teamEdit.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AdminController::teamDelete
 * @see app/Http/Controllers/AdminController.php:151
 * @route '/admin/team/delete/{id}'
 */
export const teamDelete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: teamDelete.url(args, options),
    method: 'delete',
})

teamDelete.definition = {
    methods: ["delete"],
    url: '/admin/team/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::teamDelete
 * @see app/Http/Controllers/AdminController.php:151
 * @route '/admin/team/delete/{id}'
 */
teamDelete.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return teamDelete.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::teamDelete
 * @see app/Http/Controllers/AdminController.php:151
 * @route '/admin/team/delete/{id}'
 */
teamDelete.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: teamDelete.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:169
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
 * @see app/Http/Controllers/AdminController.php:169
 * @route '/admin/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:169
 * @route '/admin/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:169
 * @route '/admin/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::changePassword
 * @see app/Http/Controllers/AdminController.php:174
 * @route '/admin/settings/change-password'
 */
export const changePassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})

changePassword.definition = {
    methods: ["post"],
    url: '/admin/settings/change-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::changePassword
 * @see app/Http/Controllers/AdminController.php:174
 * @route '/admin/settings/change-password'
 */
changePassword.url = (options?: RouteQueryOptions) => {
    return changePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::changePassword
 * @see app/Http/Controllers/AdminController.php:174
 * @route '/admin/settings/change-password'
 */
changePassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})
const AdminController = { index, userList, userAdd, userEdit, userDelete, kytList, teamList, teamAdd, teamEdit, teamDelete, settings, changePassword }

export default AdminController