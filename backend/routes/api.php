<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\IsAdmin;

// app()->routeMiddleware([
//     'is_admin' => IsAdmin::class,
// ]);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome to the admin dashboard']);
    });
    Route::get('/admin/products', [ProductController::class, 'index']);
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
});
