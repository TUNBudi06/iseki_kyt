# Route Helper for Subfolder Deployment

Ketika aplikasi Laravel di-deploy ke subfolder (misalnya `/iseki_kyt/public/`), Wayfinder routes perlu ditambahkan base path secara otomatis.

## Solusi

File `resources/js/lib/route-helper.ts` menyediakan helper function `route()` yang otomatis menambahkan `baseUrl` dari Inertia page props ke semua Wayfinder routes.

## Penggunaan

### Sebelum (Manual):
```typescript
import { page, useForm } from '@inertiajs/svelte';
import { login } from '$routes';

let form = useForm({ email: '', password: '' });

// Harus manual concat baseUrl
$form.post($page.props.baseUrl + login().url);
```

### Sesudah (Otomatis):
```typescript
import { useForm } from '@inertiajs/svelte';
import { login } from '$routes';
import { route } from '$/lib/route-helper'; // Import helper

let form = useForm({ email: '', password: '' });

// Helper otomatis menambahkan baseUrl
$form.post(route(login()).url);
```

## Contoh Penggunaan Lainnya

### Dengan Inertia Form:
```typescript
import { route } from '$/lib/route-helper';
import { store } from '$routes';

// Otomatis include base path
form.submit(route(store()));
```

### Dengan Inertia Link:
```typescript
import { Link } from '@inertiajs/svelte';
import { route } from '$/lib/route-helper';
import { show } from '$routes';

<Link href={route(show(1)).url}>Detail</Link>
```

### Dengan Router:
```typescript
import { router } from '@inertiajs/svelte';
import { route } from '$/lib/route-helper';
import { dashboard } from '$routes';

router.visit(route(dashboard()).url);
```

## Cara Kerja

1. Helper subscribe ke Inertia `page` store untuk mendapatkan `baseUrl` dari props
2. Ketika Anda call `route(wayfinder_function())`, helper akan wrap result dan prepend `baseUrl` ke URL
3. Semua route calls otomatis mendapat prefix tanpa perlu manual concat

## Konfigurasi Backend

Pastikan di controller Inertia Anda mengirim `baseUrl`:

```php
// app/Http/Controllers/MainController.php
public function index()
{
    return Inertia::render('Auth/LoginPage', [
        'baseUrl' => config('app.url'), // atau rtrim(config('app.url'), '/')
    ]);
}
```

Atau set global di middleware:
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'baseUrl' => rtrim(config('app.url'), '/'),
    ];
}
```

## Notes

- `APP_URL` di `.env` harus sudah include subfolder path (contoh: `http://localhost/iseki_kyt/public`)
- Helper ini reactive - jika baseUrl berubah (misalnya saat page navigation), routes otomatis update
