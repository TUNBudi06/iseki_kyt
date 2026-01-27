<?php

use App\Http\Controllers\MainController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'index'])->name('index');
Route::post('login', [MainController::class, 'login'])->name('login');
