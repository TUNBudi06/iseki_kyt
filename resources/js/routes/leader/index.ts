import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
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
 * @see app/Http/Controllers/LeaderController.php:76
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
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
kyt.url = (options?: RouteQueryOptions) => {
    return kyt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kyt
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
kyt.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kyt.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kyt
 * @see app/Http/Controllers/LeaderController.php:76
 * @route '/leader/kyt'
 */
kyt.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kyt.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytadd
 * @see app/Http/Controllers/LeaderController.php:101
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
 * @see app/Http/Controllers/LeaderController.php:101
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
 * @see app/Http/Controllers/LeaderController.php:101
 * @route '/leader/kyt/add/{IdKytDate}'
 */
kytadd.get = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytadd.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kytadd
 * @see app/Http/Controllers/LeaderController.php:101
 * @route '/leader/kyt/add/{IdKytDate}'
 */
kytadd.head = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kytadd.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytstore
 * @see app/Http/Controllers/LeaderController.php:116
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
 * @see app/Http/Controllers/LeaderController.php:116
 * @route '/leader/kyt/store'
 */
kytstore.url = (options?: RouteQueryOptions) => {
    return kytstore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytstore
 * @see app/Http/Controllers/LeaderController.php:116
 * @route '/leader/kyt/store'
 */
kytstore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kytstore.url(options),
    method: 'post',
})
const leader = {
    dashboard: Object.assign(dashboard, dashboard),
kyt: Object.assign(kyt, kyt),
kytadd: Object.assign(kytadd, kytadd),
kytstore: Object.assign(kytstore, kytstore),
}

export default leader