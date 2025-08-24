<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // récupérer les avis d’un produit
    public function index($productId)
    {
        return Review::where('product_id', $productId)
            ->with('user:id,name') 
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // ajouter un avis
    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:2000',
        ]);
    
        $review = Review::create([
            'product_id' => $productId,
            'user_id' => $request->user()->id, 
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
    
        return response()->json($review->load('user:id,name'), 201);
    }    
}
