<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Order creation request:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'payment_intent_id' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'items' => 'required|array',
            'customer_info' => 'required|array',
            'customer_info.name' => 'required|string',
            'customer_info.email' => 'required|email',
            'shipping_address' => 'array',
            'shipping_cost' => 'numeric|min:0',
            'shipping_method' => 'string',
            'delivery_time' => 'string',
        ]);

        if ($validator->fails()) {
            \Log::error('Order validation failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            \Log::info('Creating order with data:', [
                'user_id' => $request->user() ? $request->user()->id : null,
                'payment_intent_id' => $request->payment_intent_id,
                'amount' => $request->amount,
                'customer_info' => $request->customer_info,
                'shipping_address' => $request->shipping_address
            ]);
            
            $shippingAddress = '';
            if (isset($request->shipping_address)) {
                $addr = $request->shipping_address;
                $addressParts = [];
                if (!empty($addr['line1'])) $addressParts[] = $addr['line1'];
                if (!empty($addr['line2'])) $addressParts[] = $addr['line2'];
                if (!empty($addr['city'])) $addressParts[] = $addr['city'];
                if (!empty($addr['postal_code'])) $addressParts[] = $addr['postal_code'];
                if (!empty($addr['country'])) $addressParts[] = $addr['country'];
                $shippingAddress = implode(', ', $addressParts);
            } elseif (isset($request->customer_info['address'])) {
                $shippingAddress = $request->customer_info['address'];
            }

            $order = Order::create([
                'user_id' => $request->user() ? $request->user()->id : null,
                'payment_intent_id' => $request->payment_intent_id,
                'status' => 'pending',
                'total_price' => $request->amount,
                'currency' => 'eur',
                'customer_name' => $request->customer_info['name'],
                'customer_email' => $request->customer_info['email'],
                'customer_address' => $shippingAddress,
                'shipping_cost' => $request->shipping_cost ?? 0,
                'shipping_method' => $request->shipping_method ?? null,
                'delivery_time' => $request->delivery_time ?? null,
                'items' => $request->items,
                'payment_status' => 'paid',
            ]);

            \Log::info('Order created successfully:', ['order_id' => $order->id]);

            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Order creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erreur lors de la création de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
                      ->orderBy('created_at', 'desc')
                      ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }

    public function getUserOrders(Request $request)
    {
        \Log::info('getUserOrders called');
        $user = $request->user();
        \Log::info('User from request:', ['user_id' => $user ? $user->id : null]);
        
        if (!$user) {
            \Log::warning('No user authenticated for getUserOrders');
            return response()->json([
                'message' => 'Non autorisé'
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
                      ->orderBy('created_at', 'desc')
                      ->get();
        
        \Log::info('Orders found for user:', ['user_id' => $user->id, 'count' => $orders->count()]);

        return response()->json([
            'orders' => $orders
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Commande non trouvée'
            ], 404);
        }

        if ($user && $order->user_id !== $user->id) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        return response()->json([
            'order' => $order
        ]);
    }

    public function getAllOrders(Request $request)
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $orders = Order::with('user')
                      ->orderBy('created_at', 'desc')
                      ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }
}