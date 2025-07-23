<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Products::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|integer',
            'brand' => 'nullable|string|max:255',
        ]);

        $product = Products::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
          $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        return response()->json($product, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category_id' => 'sometimes|required|integer',
            'brand' => 'nullable|string|max:255',
        ]);

        $product->update($validated);

        return response()->json($product, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
            $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Produit supprimé avec succès'], 200);
    }
}
