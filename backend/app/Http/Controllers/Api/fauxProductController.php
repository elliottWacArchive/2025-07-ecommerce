<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class fauxProductController extends Controller
{
    public function index(): JsonResponse
    {
        $fakeProducts = [
            ['id' => 1, 'name' => 'Produit de test A', 'price' => 9.99],
            ['id' => 2, 'name' => 'Produit de test B', 'price' => 19.99],
        ];

        return response()->json($fakeProducts);
    }
}
