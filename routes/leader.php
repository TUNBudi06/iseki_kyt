<?php

use App\Http\Controllers\LeaderController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [LeaderController::class, 'dashboard'])->name('leader.dashboard');
