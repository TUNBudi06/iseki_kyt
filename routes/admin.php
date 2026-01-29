<?php

use App\Http\Controllers\AdminController;

Route::get('/home', [AdminController::class, 'index'])->name('admin.home');
Route::prefix('user')->group(function () {
    Route::get('/list', [AdminController::class, 'userList'])->name('admin.user.list');
});
