<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
        public function index(Request $request)
    {
        $query = Product::with(['category', 'subcategory', 'subSubcategory']);

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('subcategory')) {
            $query->where('subcategory_id', $request->subcategory);
        }

        if ($request->has('subsubcategory')) {
            $query->where('sub_subcategory_id', $request->subsubcategory);
        }

        $products = $query->get();
        // Expose computed attributes
        $products->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($products);
    }

    public function show(string $id)
    {
        $product = Product::with(['category', 'subcategory', 'subSubcategory'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $product->increment('views');
        $product->append(['is_on_promo', 'current_price']);

        return response()->json($product, 200);
    }

    public function popular()
    {
        $popularProducts = Product::with('category')
            ->orderBy('views', 'desc')
            ->take(10)
            ->get();
        
        $popularProducts->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($popularProducts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:subcategories,id',
            'sub_subcategory_id' => 'nullable|integer|exists:sub_subcategories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'discount_percentage' => 'nullable|integer|min:1|max:90',
            'promo_starts_at' => 'nullable|date',
            'promo_ends_at' => 'nullable|date|after_or_equal:promo_starts_at',
        ]);

        try {
            $images = [];
            
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\-_.]/', '', $image->getClientOriginalName());
                    $image->move(public_path('products'), $imageName);
                    $images[] = '/products/' . $imageName;
                }
            }
            
            $validated['images'] = $images;
            
            // Garder la première image comme image principale pour compatibilité
            if (!empty($images)) {
                $validated['image'] = $images[0];
            }

            $product = Product::create($validated);
            $product->append(['is_on_promo', 'current_price']);
            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du produit',
                'error' => $e->getMessage()
            ], 500);
        };
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:subcategories,id',
            'sub_subcategory_id' => 'nullable|integer|exists:sub_subcategories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'discount_percentage' => 'nullable|integer|min:1|max:90',
            'promo_starts_at' => 'nullable|date',
            'promo_ends_at' => 'nullable|date|after_or_equal:promo_starts_at',
        ]);

        try {
            $product = Product::findOrFail($id);
            $newImages = [];
            
            if ($request->hasFile('images')) {
                // Supprimer les anciennes images
                if ($product->images) {
                    foreach ($product->images as $oldImage) {
                        if (file_exists(public_path($oldImage))) {
                            unlink(public_path($oldImage));
                        }
                    }
                }
                
                // Traiter les nouvelles images
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\-_.]/', '', $image->getClientOriginalName());
                    $image->move(public_path('products'), $imageName);
                    $newImages[] = '/products/' . $imageName;
                }
                
                $validated['images'] = $newImages;
                
                // Mettre à jour l'image principale
                if (!empty($newImages)) {
                    $validated['image'] = $newImages[0];
                }
            }
            
            $product->update($validated);
            $product->load(['category', 'subcategory', 'subSubcategory']);
            $product->append(['is_on_promo', 'current_price']);
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            
            if ($product->image && file_exists(public_path($product->image))) {
                unlink(public_path($product->image));
            }
            
            $product->delete();
            return response()->json([
                'message' => 'Produit supprimé avec succès'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byCategory(Request $request)
    {
        $categoryName = $request->query('category');

        if (!$categoryName) {
            return response()->json(['message' => 'Nom de catégorie manquant'], 400);
        }

        $products = Product::whereHas('category', function ($query) use ($categoryName) {
            $query->where('name', $categoryName);
        })->with('category')->get();

        if ($products->isEmpty()) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $products->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($products);
    }

    public function search(Request $request)
    {
        $name = $request->query('name');

        if (!$name) {
            return response()->json([]); 
        }

        $products = Product::where('name', 'like', '%' . $name . '%')->get();

        $products->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($products); 
    }
    
    public function bySubcategory(Request $request)
    {
        $subcategoryId = $request->query('subcategory_id');

        $products = Product::where('subcategory_id', $subcategoryId)->get();
        $products->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($products);
    }

    public function bySubSubcategory(Request $request)
    {
        $subSubcategoryId = $request->query('subsubcategory_id');

        $products = Product::where('sub_subcategory_id', $subSubcategoryId)->get();
        $products->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($products);
    }

    public function related(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([], 200);
        }
        $query = Product::query();
        if ($product->sub_subcategory_id) {
            $query->where('sub_subcategory_id', $product->sub_subcategory_id);
        } elseif ($product->subcategory_id) {
            $query->where('subcategory_id', $product->subcategory_id);
        } elseif ($product->category_id) {
            $query->where('category_id', $product->category_id);
        }
        $related = $query->where('id', '!=', $product->id)->take(10)->get();
        $related->each(function ($p) { $p->append(['is_on_promo', 'current_price']); });
        return response()->json($related);
    }
}