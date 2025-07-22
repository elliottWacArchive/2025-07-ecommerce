<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class fauxProductController extends Controller
{
    public function index(): JsonResponse
    {
        $fakeProducts = [
            ['id' => 1, 'name' => 'test 1', 'prix' => 9.99],
            ['id' => 2, 'name' => 'test 2', 'prix' => 19.99],
        ];

        return response()->json($fakeProducts);
    }
}
