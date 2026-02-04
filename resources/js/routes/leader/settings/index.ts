import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\LeaderController::changePassword
 * @see app/Http/Controllers/LeaderController.php:203
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
 * @see app/Http/Controllers/LeaderController.php:203
 * @route '/leader/settings/change-password'
 */
changePassword.url = (options?: RouteQueryOptions) => {
    return changePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaderController::changePassword
 * @see app/Http/Controllers/LeaderController.php:203
 * @route '/leader/settings/change-password'
 */
changePassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})
const settings = {
    changePassword: Object.assign(changePassword, changePassword),
}

export default settings