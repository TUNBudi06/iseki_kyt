import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import settings69f00b from './settings'
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
* @see \App\Http\Controllers\LeaderController::kyt
 * @see app/Http/Controllers/LeaderController.php:82
 * @route '/leader/kyt'
 */
export const kyt = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kyt.url(options),
    method: 'get',
})

kyt.definition = {
    methods: ["get","head"],
    url: '/leader/kyt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::kyt
 * @see app/Http/Controllers/LeaderController.php:82
 * @route '/leader/kyt'
 */
kyt.url = (options?: RouteQueryOptions) => {
    return kyt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kyt
 * @see app/Http/Controllers/LeaderController.php:82
 * @route '/leader/kyt'
 */
kyt.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kyt.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kyt
 * @see app/Http/Controllers/LeaderController.php:82
 * @route '/leader/kyt'
 */
kyt.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kyt.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytadd
 * @see app/Http/Controllers/LeaderController.php:128
 * @route '/leader/kyt/add/{IdKytDate}'
 */
export const kytadd = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytadd.url(args, options),
    method: 'get',
})

kytadd.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/add/{IdKytDate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::kytadd
 * @see app/Http/Controllers/LeaderController.php:128
 * @route '/leader/kyt/add/{IdKytDate}'
 */
kytadd.url = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return kytadd.definition.url
            .replace('{IdKytDate}', parsedArgs.IdKytDate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytadd
 * @see app/Http/Controllers/LeaderController.php:128
 * @route '/leader/kyt/add/{IdKytDate}'
 */
kytadd.get = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytadd.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kytadd
 * @see app/Http/Controllers/LeaderController.php:128
 * @route '/leader/kyt/add/{IdKytDate}'
 */
kytadd.head = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kytadd.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytstore
 * @see app/Http/Controllers/LeaderController.php:143
 * @route '/leader/kyt/store'
 */
export const kytstore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytstore.url(options),
    method: 'post',
})

kytstore.definition = {
    methods: ["post"],
    url: '/leader/kyt/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::kytstore
 * @see app/Http/Controllers/LeaderController.php:143
 * @route '/leader/kyt/store'
 */
kytstore.url = (options?: RouteQueryOptions) => {
    return kytstore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytstore
 * @see app/Http/Controllers/LeaderController.php:143
 * @route '/leader/kyt/store'
 */
kytstore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytstore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::kytdelete
 * @see app/Http/Controllers/LeaderController.php:230
 * @route '/leader/kyt/delete/{id}'
 */
export const kytdelete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: kytdelete.url(args, options),
    method: 'delete',
})

kytdelete.definition = {
    methods: ["delete"],
    url: '/leader/kyt/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LeaderController::kytdelete
 * @see app/Http/Controllers/LeaderController.php:230
 * @route '/leader/kyt/delete/{id}'
 */
kytdelete.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return kytdelete.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytdelete
 * @see app/Http/Controllers/LeaderController.php:230
 * @route '/leader/kyt/delete/{id}'
 */
kytdelete.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: kytdelete.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LeaderController::kytedit
 * @see app/Http/Controllers/LeaderController.php:261
 * @route '/leader/kyt/edit/{id}'
 */
export const kytedit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytedit.url(args, options),
    method: 'get',
})

kytedit.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/edit/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::kytedit
 * @see app/Http/Controllers/LeaderController.php:261
 * @route '/leader/kyt/edit/{id}'
 */
kytedit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return kytedit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytedit
 * @see app/Http/Controllers/LeaderController.php:261
 * @route '/leader/kyt/edit/{id}'
 */
kytedit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytedit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kytedit
 * @see app/Http/Controllers/LeaderController.php:261
 * @route '/leader/kyt/edit/{id}'
 */
kytedit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kytedit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytupdate
 * @see app/Http/Controllers/LeaderController.php:293
 * @route '/leader/kyt/update/{id}'
 */
export const kytupdate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytupdate.url(args, options),
    method: 'post',
})

kytupdate.definition = {
    methods: ["post"],
    url: '/leader/kyt/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::kytupdate
 * @see app/Http/Controllers/LeaderController.php:293
 * @route '/leader/kyt/update/{id}'
 */
kytupdate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return kytupdate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytupdate
 * @see app/Http/Controllers/LeaderController.php:293
 * @route '/leader/kyt/update/{id}'
 */
kytupdate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytupdate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::kytsubmitpenanganan
 * @see app/Http/Controllers/LeaderController.php:431
 * @route '/leader/kyt/submit-penanganan/{id}'
 */
export const kytsubmitpenanganan = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytsubmitpenanganan.url(args, options),
    method: 'post',
})

kytsubmitpenanganan.definition = {
    methods: ["post"],
    url: '/leader/kyt/submit-penanganan/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::kytsubmitpenanganan
 * @see app/Http/Controllers/LeaderController.php:431
 * @route '/leader/kyt/submit-penanganan/{id}'
 */
kytsubmitpenanganan.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return kytsubmitpenanganan.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytsubmitpenanganan
 * @see app/Http/Controllers/LeaderController.php:431
 * @route '/leader/kyt/submit-penanganan/{id}'
 */
kytsubmitpenanganan.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytsubmitpenanganan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::penangananadd
 * @see app/Http/Controllers/LeaderController.php:347
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
export const penangananadd = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penangananadd.url(args, options),
    method: 'get',
})

penangananadd.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/penanganan/add/{kytListId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::penangananadd
 * @see app/Http/Controllers/LeaderController.php:347
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
penangananadd.url = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return penangananadd.definition.url
            .replace('{kytListId}', parsedArgs.kytListId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::penangananadd
 * @see app/Http/Controllers/LeaderController.php:347
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
penangananadd.get = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penangananadd.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::penangananadd
 * @see app/Http/Controllers/LeaderController.php:347
 * @route '/leader/kyt/penanganan/add/{kytListId}'
 */
penangananadd.head = (args: { kytListId: string | number } | [kytListId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: penangananadd.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::penangananstore
 * @see app/Http/Controllers/LeaderController.php:456
 * @route '/leader/kyt/penanganan/store'
 */
export const penangananstore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: penangananstore.url(options),
    method: 'post',
})

penangananstore.definition = {
    methods: ["post"],
    url: '/leader/kyt/penanganan/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::penangananstore
 * @see app/Http/Controllers/LeaderController.php:456
 * @route '/leader/kyt/penanganan/store'
 */
penangananstore.url = (options?: RouteQueryOptions) => {
    return penangananstore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::penangananstore
 * @see app/Http/Controllers/LeaderController.php:456
 * @route '/leader/kyt/penanganan/store'
 */
penangananstore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: penangananstore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::penanangananedit
 * @see app/Http/Controllers/LeaderController.php:356
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
export const penanangananedit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penanangananedit.url(args, options),
    method: 'get',
})

penanangananedit.definition = {
    methods: ["get","head"],
    url: '/leader/kyt/penanganan/edit/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaderController::penanangananedit
 * @see app/Http/Controllers/LeaderController.php:356
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
penanangananedit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return penanangananedit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::penanangananedit
 * @see app/Http/Controllers/LeaderController.php:356
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
penanangananedit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penanangananedit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::penanangananedit
 * @see app/Http/Controllers/LeaderController.php:356
 * @route '/leader/kyt/penanganan/edit/{id}'
 */
penanangananedit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: penanangananedit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::penangananupdate
 * @see app/Http/Controllers/LeaderController.php:380
 * @route '/leader/kyt/penanganan/update/{id}'
 */
export const penangananupdate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: penangananupdate.url(args, options),
    method: 'post',
})

penangananupdate.definition = {
    methods: ["post"],
    url: '/leader/kyt/penanganan/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaderController::penangananupdate
 * @see app/Http/Controllers/LeaderController.php:380
 * @route '/leader/kyt/penanganan/update/{id}'
 */
penangananupdate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return penangananupdate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::penangananupdate
 * @see app/Http/Controllers/LeaderController.php:380
 * @route '/leader/kyt/penanganan/update/{id}'
 */
penangananupdate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: penangananupdate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:206
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
 * @see app/Http/Controllers/LeaderController.php:206
 * @route '/leader/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:206
 * @route '/leader/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::settings
 * @see app/Http/Controllers/LeaderController.php:206
 * @route '/leader/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})
const leader = {
    dashboard: Object.assign(dashboard, dashboard),
kyt: Object.assign(kyt, kyt),
kytadd: Object.assign(kytadd, kytadd),
kytstore: Object.assign(kytstore, kytstore),
kytdelete: Object.assign(kytdelete, kytdelete),
kytedit: Object.assign(kytedit, kytedit),
kytupdate: Object.assign(kytupdate, kytupdate),
kytsubmitpenanganan: Object.assign(kytsubmitpenanganan, kytsubmitpenanganan),
penangananadd: Object.assign(penangananadd, penangananadd),
penangananstore: Object.assign(penangananstore, penangananstore),
penanangananedit: Object.assign(penanangananedit, penanangananedit),
penangananupdate: Object.assign(penangananupdate, penangananupdate),
settings: Object.assign(settings, settings69f00b),
}

export default leader