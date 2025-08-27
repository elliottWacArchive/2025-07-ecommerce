<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subcategory;
use Illuminate\Validation\Rule;

class SubcategoryController extends Controller
{
    public function byCategory(Request $request)
    {
        $categoryId = $request->query('category_id');

        if (!$categoryId) {
            return response()->json(['message' => 'ID de catégorie manquant'], 400);
        }

        $subcategories = Subcategory::where('category_id', $categoryId)->get();

        return response()->json($subcategories);
    }

    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');
        
        if (!$categoryId) {
            return response()->json(['message' => 'ID de catégorie manquant'], 400);
        }

        $subcategories = Subcategory::where('category_id', $categoryId)
            ->withCount('subSubcategories')
            ->get();

        return response()->json($subcategories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id'
        ]);

        $existingSubcategory = Subcategory::where('category_id', $request->category_id)
            ->where('name', $request->name)
            ->first();

        if ($existingSubcategory) {
            return response()->json([
                'message' => 'Une sous-catégorie avec ce nom existe déjà pour cette catégorie',
                'errors' => ['name' => ['Cette sous-catégorie existe déjà']]
            ], 422);
        }

        $subcategory = Subcategory::create($request->all());

        return response()->json($subcategory, 201);
    }

    public function update(Request $request, $id)
    {
        $subcategory = Subcategory::findOrFail($id);

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subcategories')->where(function ($query) use ($request, $subcategory) {
                    return $query->where('category_id', $subcategory->category_id);
                })->ignore($subcategory->id)
            ]
        ]);

        $subcategory->update($request->all());

        return response()->json($subcategory);
    }

    public function destroy($id)
    {
        $subcategory = Subcategory::findOrFail($id);

        if ($subcategory->subSubcategories()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cette sous-catégorie car elle contient des sous-sous-catégories'
            ], 409);
        }

        $subcategory->delete();

        return response()->json(['message' => 'Sous-catégorie supprimée avec succès']);
    }
}