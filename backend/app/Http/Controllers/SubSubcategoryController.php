<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubSubcategory;

class SubSubcategoryController extends Controller
{
    public function bySubcategory(Request $request)
    {
        $subcategoryId = $request->query('subcategory_id');

        if (!$subcategoryId) {
            return response()->json(['message' => 'ID de sous-catégorie manquant'], 400);
        }

        $subSubcategories = SubSubcategory::where('subcategory_id', $subcategoryId)->get();

        return response()->json($subSubcategories);
    }
}
