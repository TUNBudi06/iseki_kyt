<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LoginCheckMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(auth()->check()){
            if (auth()->user()->role == 'admin') {
                return redirect()->route('admin.home');
            }

            if (auth()->user()->role == 'user') {
                return redirect('/user/dashboard');
            }
        }

        return $next($request);
    }
}
