<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


use App\Http\Controllers\fauxProductController;

Route::get('./Api/fauxProductController.php', [\App\Http\Controllers\Api\FauxProductController::class, 'index']);
