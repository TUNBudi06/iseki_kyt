<?php

use App\Http\Controllers\LeaderController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [LeaderController::class, 'dashboard'])->name('leader.dashboard');
//Route::get('/kyt-history', [LeaderController::class, 'kytHistory'])->name('leader.kyt-history');
Route::prefix('kyt')->group(function () {
    Route::get('/', [LeaderController::class, 'kytHistory'])->name('leader.kyt');
    Route::get('/add/{IdKytDate}', [LeaderController::class, 'addKyt'])->name('leader.kytadd');
    Route::post('/store', [LeaderController::class, 'storeKyt'])->name('leader.kytstore');
});

// Settings Routes
Route::get('/settings', [LeaderController::class, 'settings'])->name('leader.settings');
Route::post('/settings/change-password', [LeaderController::class, 'changePassword'])->name('leader.settings.changePassword');

