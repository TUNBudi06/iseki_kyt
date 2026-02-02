import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:20
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
 * @see app/Http/Controllers/LeaderController.php:20
 * @route '/leader/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:20
 * @route '/leader/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::dashboard
 * @see app/Http/Controllers/LeaderController.php:20
 * @route '/leader/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:69
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
 * @see app/Http/Controllers/LeaderController.php:69
 * @route '/leader/kyt'
 */
kytHistory.url = (options?: RouteQueryOptions) => {
    return kytHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:69
 * @route '/leader/kyt'
 */
kytHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kytHistory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::kytHistory
 * @see app/Http/Controllers/LeaderController.php:69
 * @route '/leader/kyt'
 */
kytHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kytHistory.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::addKyt
 * @see app/Http/Controllers/LeaderController.php:94
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
 * @see app/Http/Controllers/LeaderController.php:94
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
 * @see app/Http/Controllers/LeaderController.php:94
 * @route '/leader/kyt/add/{IdKytDate}'
 */
addKyt.get = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addKyt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaderController::addKyt
 * @see app/Http/Controllers/LeaderController.php:94
 * @route '/leader/kyt/add/{IdKytDate}'
 */
addKyt.head = (args: { IdKytDate: string | number } | [IdKytDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: addKyt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaderController::storeKyt
 * @see app/Http/Controllers/LeaderController.php:109
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
 * @see app/Http/Controllers/LeaderController.php:109
 * @route '/leader/kyt/store'
 */
storeKyt.url = (options?: RouteQueryOptions) => {
    return storeKyt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::storeKyt
 * @see app/Http/Controllers/LeaderController.php:109
 * @route '/leader/kyt/store'
 */
storeKyt.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKyt.url(options),
    method: 'post',
})
const LeaderController = { dashboard, kytHistory, addKyt, storeKyt }

export default LeaderController