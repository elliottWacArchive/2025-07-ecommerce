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
            'existing_images' => 'nullable|string',
            'discount_percentage' => 'nullable|integer|min:1|max:90',
            'promo_starts_at' => 'nullable|date',
            'promo_ends_at' => 'nullable|date|after_or_equal:promo_starts_at',
        ]);

        try {
            $finalImages = [];
            
            if ($request->has('existing_images')) {
                $existingImages = json_decode($request->input('existing_images'), true);
                if (is_array($existingImages)) {
                    $finalImages = $existingImages;
                }
            }
            
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\-_.]/', '', $image->getClientOriginalName());
                    $image->move(public_path('products'), $imageName);
                    $finalImages[] = '/products/' . $imageName;
                }
            }
            
            $validated['images'] = $finalImages;
            
            // Garder la première image comme image principale pour compatibilité
            if (!empty($finalImages)) {
                $validated['image'] = $finalImages[0];
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
            'existing_images' => 'nullable|string',
            'image_urls' => 'nullable|string',
            'discount_percentage' => 'nullable|integer|min:1|max:90',
            'promo_starts_at' => 'nullable|date',
            'promo_ends_at' => 'nullable|date|after_or_equal:promo_starts_at',
        ]);

        try {
            $product = Product::findOrFail($id);
            
            $oldImages = $product->images ?: [];
            $finalImages = [];
            
            if ($request->has('existing_images')) {
                $existingImages = json_decode($request->input('existing_images'), true);
                if (is_array($existingImages)) {
                    $finalImages = $existingImages;
                }
            }
            
            if ($request->has('image_urls')) {
                $imageUrls = json_decode($request->input('image_urls'), true);
                if (is_array($imageUrls)) {
                    $finalImages = array_merge($finalImages, $imageUrls);
                }
            }
            
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\-_.]/', '', $image->getClientOriginalName());
                    $image->move(public_path('products'), $imageName);
                    $finalImages[] = '/products/' . $imageName;
                }
            }
            
            if (is_array($oldImages)) {
                foreach ($oldImages as $oldImage) {
                    if (!in_array($oldImage, $finalImages) && !str_starts_with($oldImage, 'http')) {
                        $imagePath = public_path($oldImage);
                        if (file_exists($imagePath)) {
                            unlink($imagePath);
                        }
                    }
                }
            }
            
            $validated['images'] = $finalImages;
            
            if (!empty($finalImages)) {
                $validated['image'] = $finalImages[0];
            } else {
                $validated['image'] = null;
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

    public function deleteImage(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            $imageToDelete = $request->input('image');
            
            if (!$imageToDelete) {
                return response()->json(['message' => 'Image non spécifiée'], 400);
            }
            
            $images = $product->images ?: [];
            
            if (!in_array($imageToDelete, $images)) {
                return response()->json(['message' => 'Image non trouvée pour ce produit'], 404);
            }
            
            $updatedImages = array_values(array_filter($images, function($img) use ($imageToDelete) {
                return $img !== $imageToDelete;
            }));
            
            if (!str_starts_with($imageToDelete, 'http')) {
                $imagePath = public_path($imageToDelete);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            
            $product->images = $updatedImages;
            
            if ($product->image === $imageToDelete) {
                $product->image = !empty($updatedImages) ? $updatedImages[0] : null;
            }
            
            $product->save();
            
            return response()->json([
                'message' => 'Image supprimée avec succès',
                'product' => $product->load(['category', 'subcategory', 'subSubcategory'])
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de l\'image',
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
            
            if ($product->images && is_array($product->images)) {
                foreach ($product->images as $image) {
                    if (!str_starts_with($image, 'http')) {
                        $imagePath = public_path($image);
                        if (file_exists($imagePath)) {
                            unlink($imagePath);
                        }
                    }
                }
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