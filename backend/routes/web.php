<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'isadmin'])->group(function () {
    Route::get('/admin', function () {
        return view('admin.dashboard');  // ou autre vue admin
    });
});

Route::get('/test-cache-driver', function () {
    return config('cache.default');
});

