<?php

use App\Http\Controllers\MainController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\hasLoginMiddleware;
use App\Http\Middleware\LoginCheckMiddleware;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'index'])->name('index')->middleware(LoginCheckMiddleware::class);
Route::post('login', [MainController::class, 'login'])->name('login');
Route::post('logout', [MainController::class, 'logout'])->name('logout');

Route::prefix('admin')->middleware([AdminMiddleware::class])->group(function () {
    require __DIR__ . '/admin.php';
});

Route::prefix('leader')->middleware([ hasLoginMiddleware::class])->group(function () {
    require __DIR__ . '/leader.php';
});
