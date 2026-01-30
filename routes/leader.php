<?php





Route::get('/dashboard', function () {
    return view('leader.dashboard');
})->name('leader.dashboard');
