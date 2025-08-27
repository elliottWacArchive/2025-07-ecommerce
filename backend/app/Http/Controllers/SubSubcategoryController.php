<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubSubcategory;
use Illuminate\Validation\Rule;

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

    public function index(Request $request)
    {
        $subcategoryId = $request->query('subcategory_id');
        
        if (!$subcategoryId) {
            return response()->json(['message' => 'ID de sous-catégorie manquant'], 400);
        }

        $subSubcategories = SubSubcategory::where('subcategory_id', $subcategoryId)->get();

        return response()->json($subSubcategories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subcategory_id' => 'required|exists:subcategories,id'
        ]);

        $existingSubSubcategory = SubSubcategory::where('subcategory_id', $request->subcategory_id)
            ->where('name', $request->name)
            ->first();

        if ($existingSubSubcategory) {
            return response()->json([
                'message' => 'Une sous-sous-catégorie avec ce nom existe déjà pour cette sous-catégorie',
                'errors' => ['name' => ['Cette sous-sous-catégorie existe déjà']]
            ], 422);
        }

        $subSubcategory = SubSubcategory::create($request->all());

        return response()->json($subSubcategory, 201);
    }

    public function update(Request $request, $id)
    {
        $subSubcategory = SubSubcategory::findOrFail($id);

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sub_subcategories')->where(function ($query) use ($request, $subSubcategory) {
                    return $query->where('subcategory_id', $subSubcategory->subcategory_id);
                })->ignore($subSubcategory->id)
            ]
        ]);

        $subSubcategory->update($request->all());

        return response()->json($subSubcategory);
    }

    public function destroy($id)
    {
        $subSubcategory = SubSubcategory::findOrFail($id);
        $subSubcategory->delete();

        return response()->json(['message' => 'Sous-sous-catégorie supprimée avec succès']);
    }
}