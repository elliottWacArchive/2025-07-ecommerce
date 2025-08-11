<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non connecté'], 401);
        }

        $cartItems = Cart::where('user_id', $user->id)
            ->with('product')
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->product->id,
                    'name' => $cartItem->product->name,
                    'brand' => $cartItem->product->brand,
                    'price' => $cartItem->product->price,
                    'image' => $cartItem->product->image,
                    'stock' => $cartItem->product->stock,
                    'quantity' => $cartItem->quantity
                ];
            });

        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non connecté'], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        $product = Products::find($request->product_id);
        $quantity = $request->quantity ?? 1;

        if ($product->stock < $quantity) {
            return response()->json(['error' => 'Stock insuffisant'], 400);
        }

        $existingCartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + $quantity;
            
            if ($newQuantity > $product->stock) {
                return response()->json(['error' => 'Stock maximum atteint'], 400);
            }
            
            $existingCartItem->update(['quantity' => $newQuantity]);
            $cartItem = $existingCartItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'message' => 'Produit ajouté au panier',
            'cart_item' => $cartItem
        ]);
    }

    public function update(Request $request, $productId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non connecté'], 401);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Produit non trouvé dans le panier'], 404);
        }

        $product = $cartItem->product;
        
        if ($request->quantity > $product->stock) {
            return response()->json(['error' => 'Stock insuffisant'], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Quantité mise à jour',
            'cart_item' => $cartItem
        ]);
    }

    public function destroy($productId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non connecté'], 401);
        }

        $cartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Produit non trouvé dans le panier'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Produit supprimé du panier']);
    }

    public function clear()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non connecté'], 401);
        }

        Cart::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Panier vidé']);
    }

    public function sync(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non connecté'], 401);
        }

        $localCart = $request->input('cart', []);

        foreach ($localCart as $item) {
            $product = Products::find($item['id']);
            
            if (!$product) {
                continue;
            }

            $existingCartItem = Cart::where('user_id', $user->id)
                ->where('product_id', $item['id'])
                ->first();

            if ($existingCartItem) {
                $newQuantity = min(
                    $existingCartItem->quantity + $item['quantity'],
                    $product->stock
                );
                $existingCartItem->update(['quantity' => $newQuantity]);
            } else {
                $quantity = min($item['quantity'], $product->stock);
                Cart::create([
                    'user_id' => $user->id,
                    'product_id' => $item['id'],
                    'quantity' => $quantity
                ]);
            }
        }

        return $this->index();
    }
}