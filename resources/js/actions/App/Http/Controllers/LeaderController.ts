import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:24
 * @route '/leader/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/leader/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:24
 * @route '/leader/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:24
 * @route '/leader/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:24
 * @route '/leader/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
export const kytHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytHistory.url(options),
    method: 'get',
})

kytHistory.definition = {
    methods: ["get","head"],
    url: '/leader/kyt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
kytHistory.url = (options?: RouteQueryOptions) => {
    return kytHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
kytHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytHistory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
kytHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kytHistory.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::addKyt
 * @see app/Http/Controllers/LeaderController.php:121
 * @route '/leader/kyt/add/{IdKytDate}'
 */
export const addKyt = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addKyt.url(args, options),
    method: 'get',
})

addKyt.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/add/{IdKytDate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::addKyt
 * @see app/Http/Controllers/LeaderController.php:121
 * @route '/leader/kyt/add/{IdKytDate}'
 */
addKyt.url = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { IdKytDate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    IdKytDate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        IdKytDate: args.IdKytDate,
                }

    return addKyt.definition.url
            .replace('{IdKytDate}', parsedArgs.IdKytDate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::addKyt
 * @see app/Http/Controllers/LeaderController.php:121
 * @route '/leader/kyt/add/{IdKytDate}'
 */
addKyt.get = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addKyt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::addKyt
 * @see app/Http/Controllers/LeaderController.php:121
 * @route '/leader/kyt/add/{IdKytDate}'
 */
addKyt.head = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: addKyt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::storeKyt
 * @see app/Http/Controllers/LeaderController.php:136
 * @route '/leader/kyt/store'
 */
export const storeKyt = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKyt.url(options),
    method: 'post',
})

storeKyt.definition = {
    methods: ["post"],
    url: '/leader/kyt/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::storeKyt
 * @see app/Http/Controllers/LeaderController.php:136
 * @route '/leader/kyt/store'
 */
storeKyt.url = (options?: RouteQueryOptions) => {
    return storeKyt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::storeKyt
 * @see app/Http/Controllers/LeaderController.php:136
 * @route '/leader/kyt/store'
 */
storeKyt.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKyt.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::deleteKyt
 * @see app/Http/Controllers/LeaderController.php:223
 * @route '/leader/kyt/delete/{id}'
 */
export const deleteKyt = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteKyt.url(args, options),
    method: 'delete',
})

deleteKyt.definition = {
    methods: ["delete"],
    url: '/leader/kyt/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LeaderController::deleteKyt
 * @see app/Http/Controllers/LeaderController.php:223
 * @route '/leader/kyt/delete/{id}'
 */
deleteKyt.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteKyt.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::deleteKyt
 * @see app/Http/Controllers/LeaderController.php:223
 * @route '/leader/kyt/delete/{id}'
 */
deleteKyt.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteKyt.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LeaderController::editKyt
 * @see app/Http/Controllers/LeaderController.php:254
 * @route '/leader/kyt/edit/{id}'
 */
export const editKyt = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editKyt.url(args, options),
    method: 'get',
})

editKyt.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/edit/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::editKyt
 * @see app/Http/Controllers/LeaderController.php:254
 * @route '/leader/kyt/edit/{id}'
 */
editKyt.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return editKyt.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::editKyt
 * @see app/Http/Controllers/LeaderController.php:254
 * @route '/leader/kyt/edit/{id}'
 */
editKyt.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editKyt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::editKyt
 * @see app/Http/Controllers/LeaderController.php:254
 * @route '/leader/kyt/edit/{id}'
 */
editKyt.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editKyt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::updateKyt
 * @see app/Http/Controllers/LeaderController.php:286
 * @route '/leader/kyt/update/{id}'
 */
export const updateKyt = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateKyt.url(args, options),
    method: 'post',
})

updateKyt.definition = {
    methods: ["post"],
    url: '/leader/kyt/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::updateKyt
 * @see app/Http/Controllers/LeaderController.php:286
 * @route '/leader/kyt/update/{id}'
 */
updateKyt.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateKyt.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::updateKyt
 * @see app/Http/Controllers/LeaderController.php:286
 * @route '/leader/kyt/update/{id}'
 */
updateKyt.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateKyt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::submitPenanganan
 * @see app/Http/Controllers/LeaderController.php:424
 * @route '/leader/kyt/submit-penanganan/{id}'
 */
export const submitPenanganan = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPenanganan.url(args, options),
    method: 'post',
})

submitPenanganan.definition = {
    methods: ["post"],
    url: '/leader/kyt/submit-penanganan/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::submitPenanganan
 * @see app/Http/Controllers/LeaderController.php:424
 * @route '/leader/kyt/submit-penanganan/{id}'
 */
submitPenanganan.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return submitPenanganan.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::submitPenanganan
 * @see app/Http/Controllers/LeaderController.php:424
 * @route '/leader/kyt/submit-penanganan/{id}'
 */
submitPenanganan.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPenanganan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::addPenanganan
 * @see app/Http/Controllers/LeaderController.php:340
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
export const addPenanganan = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addPenanganan.url(args, options),
    method: 'get',
})

addPenanganan.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/penanganan/add/{kytListId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::addPenanganan
 * @see app/Http/Controllers/LeaderController.php:340
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
addPenanganan.url = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kytListId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kytListId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kytListId: args.kytListId,
                }

    return addPenanganan.definition.url
            .replace('{kytListId}', parsedArgs.kytListId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::addPenanganan
 * @see app/Http/Controllers/LeaderController.php:340
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
addPenanganan.get = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addPenanganan.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::addPenanganan
 * @see app/Http/Controllers/LeaderController.php:340
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
addPenanganan.head = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: addPenanganan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::storePenanganan
 * @see app/Http/Controllers/LeaderController.php:449
 * @route '/leader/kyt/penanganan/store'
 */
export const storePenanganan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePenanganan.url(options),
    method: 'post',
})

storePenanganan.definition = {
    methods: ["post"],
    url: '/leader/kyt/penanganan/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::storePenanganan
 * @see app/Http/Controllers/LeaderController.php:449
 * @route '/leader/kyt/penanganan/store'
 */
storePenanganan.url = (options?: RouteQueryOptions) => {
    return storePenanganan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::storePenanganan
 * @see app/Http/Controllers/LeaderController.php:449
 * @route '/leader/kyt/penanganan/store'
 */
storePenanganan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePenanganan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::editPenanganan
 * @see app/Http/Controllers/LeaderController.php:349
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
export const editPenanganan = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editPenanganan.url(args, options),
    method: 'get',
})

editPenanganan.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/penanganan/edit/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::editPenanganan
 * @see app/Http/Controllers/LeaderController.php:349
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
editPenanganan.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return editPenanganan.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::editPenanganan
 * @see app/Http/Controllers/LeaderController.php:349
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
editPenanganan.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editPenanganan.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::editPenanganan
 * @see app/Http/Controllers/LeaderController.php:349
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
editPenanganan.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editPenanganan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::updatePenanganan
 * @see app/Http/Controllers/LeaderController.php:373
 * @route '/leader/kyt/penanganan/update/{id}'
 */
export const updatePenanganan = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePenanganan.url(args, options),
    method: 'post',
})

updatePenanganan.definition = {
    methods: ["post"],
    url: '/leader/kyt/penanganan/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::updatePenanganan
 * @see app/Http/Controllers/LeaderController.php:373
 * @route '/leader/kyt/penanganan/update/{id}'
 */
updatePenanganan.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePenanganan.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::updatePenanganan
 * @see app/Http/Controllers/LeaderController.php:373
 * @route '/leader/kyt/penanganan/update/{id}'
 */
updatePenanganan.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePenanganan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:199
 * @route '/leader/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/leader/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:199
 * @route '/leader/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:199
 * @route '/leader/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:199
 * @route '/leader/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::changePassword
 * @see app/Http/Controllers/LeaderController.php:204
 * @route '/leader/settings/change-password'
 */
export const changePassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})

changePassword.definition = {
    methods: ["post"],
    url: '/leader/settings/change-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::changePassword
 * @see app/Http/Controllers/LeaderController.php:204
 * @route '/leader/settings/change-password'
 */
changePassword.url = (options?: RouteQueryOptions) => {
    return changePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::changePassword
 * @see app/Http/Controllers/LeaderController.php:204
 * @route '/leader/settings/change-password'
 */
changePassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})
const LeaderController = { dashboard, kytHistory, addKyt, storeKyt, deleteKyt, editKyt, updateKyt, submitPenanganan, addPenanganan, storePenanganan, editPenanganan, updatePenanganan, settings, changePassword }

export default LeaderController