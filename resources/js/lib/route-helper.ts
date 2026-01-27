import { page } from '@inertiajs/svelte';
import type { RouteDefinition } from '$/wayfinder';

let baseUrlStore: string = '';

// Subscribe to page store to get baseUrl
page.subscribe(($page) => {
    if ($page?.props?.baseUrl) {
        baseUrlStore = $page.props.baseUrl as string;
    }
});

/**
 * Wraps a Wayfinder route function to automatically prepend baseUrl
 *
 * @example
 * ```typescript
 * import { route } from '@/lib/route-helper';
 * import { login } from '@/routes';
 *
 * // Instead of: $page.props.baseUrl + login().url
 * // Use: route(login()).url or route(login())
 *
 * // With Inertia form:
 * form.post(route(login()).url);
 *
 * // With Inertia Link:
 * <Link href={route(dashboard()).url}>Dashboard</Link>
 * ```
 */
export function route<T extends RouteDefinition<any>>(
    routeDefinition: T
): T {
    return {
        ...routeDefinition,
        url: baseUrlStore + routeDefinition.url,
    };
}

/**
 * Alternative: Get just the full URL string directly
 *
 * @example
 * ```typescript
 * const fullUrl = routeUrl(show(1)); // Returns: "http://localhost/iseki_kyt/public/posts/1"
 * ```
 */
export function routeUrl<T extends RouteDefinition<any>>(
    routeDefinition: T
): string {
    return baseUrlStore + routeDefinition.url;
}
