<?php

use App\Http\Controllers\AdminController;

Route::get('/home', [AdminController::class, 'index'])->name('admin.home');
