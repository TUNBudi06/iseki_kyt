<?php

use App\Http\Controllers\AdminController;

Route::get('/home', [AdminController::class, 'index'])->name('admin.home');

Route::prefix('user')->group(function () {
    Route::get('/list', [AdminController::class, 'userList'])->name('admin.user.list');
    Route::post('/add', [AdminController::class, 'userAdd'])->name('admin.user.add');
    Route::put('/edit/{id}', [AdminController::class, 'userEdit'])->name('admin.user.edit');
    Route::delete('/delete/{id}', [AdminController::class, 'userDelete'])->name('admin.user.delete');
});

Route::prefix('team')->group(function () {
    Route::get('/list', [AdminController::class, 'teamList'])->name('admin.team.list');
    Route::post('/add', [AdminController::class, 'teamAdd'])->name('admin.team.add');
    Route::put('/edit/{id}', [AdminController::class, 'teamEdit'])->name('admin.team.edit');
    Route::delete('/delete/{id}', [AdminController::class, 'teamDelete'])->name('admin.team.delete');
});

