<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ShippingCostController;
use App\Http\Middleware\IsAdmin;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\SubSubcategoryController;

// app()->routeMiddleware([
//     'is_admin' => IsAdmin::class,
// ]);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{productId}', [CartController::class, 'update']);
    Route::delete('/cart/{productId}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);
    Route::post('/cart/sync', [CartController::class, 'sync']);
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
    
    // Shipping costs management routes
    Route::get('/admin/shipping-costs', [ShippingCostController::class, 'index']);
    Route::post('/admin/shipping-costs', [ShippingCostController::class, 'store']);
    Route::get('/admin/shipping-costs/{id}', [ShippingCostController::class, 'show']);
    Route::put('/admin/shipping-costs/{id}', [ShippingCostController::class, 'update']);
    Route::delete('/admin/shipping-costs/{id}', [ShippingCostController::class, 'destroy']);
});

// Produits
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/popular', [ProductController::class, 'popular']);
Route::get('/products/by-category', [ProductController::class, 'byCategory']);
Route::get('/products/by-subcategory', [ProductController::class, 'bySubcategory']);
Route::get('/products/by-subsubcategory', [ProductController::class, 'bySubSubcategory']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories/by-name', [CategoryController::class, 'getByName']);
Route::get('/subcategories/by-category', [SubcategoryController::class, 'byCategory']);
Route::get('/subsubcategories/by-subcategory', [SubSubcategoryController::class, 'bySubcategory']);
Route::get('/products/by-subsubcategory', [ProductController::class, 'bySubSubcategory']);

// Shipping costs public routes
Route::post('/shipping/calculate', [ShippingCostController::class, 'calculate']);
Route::get('/shipping/options', [ShippingCostController::class, 'getOptions']);
Route::get('/shipping/countries', [ShippingCostController::class, 'getCountries']);
Route::get('/shipping/delivery-methods', [ShippingCostController::class, 'getDeliveryMethods']);