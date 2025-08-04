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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome to the admin dashboard']);
    });
    Route::get('/admin/products', [ProductController::class, 'index']);
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::post('/admin/products/{id}/update', [ProductController::class, 'update']); // Route pour FormData
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
    
    // User management routes
    Route::get('/admin/users', [AuthController::class, 'getAllUsers']);
    Route::put('/admin/users/{id}/role', [AuthController::class, 'updateUserRole']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/popular', [ProductController::class, 'popular']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/by-category', [ProductController::class, 'byCategory']);

