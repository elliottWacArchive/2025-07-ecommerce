<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    public function createPaymentIntent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'currency' => 'string|in:eur,usd',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $stripeKey = env('STRIPE_SECRET_KEY');
            if (!$stripeKey || $stripeKey === 'sk_test_51XXXXXXXXX') {
                return response()->json([
                    'message' => 'Stripe n\'est pas configuré correctement',
                    'error' => 'Clé secrète manquante'
                ], 500);
            }

            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => $request->currency ?? 'eur',
                'metadata' => [
                    'user_id' => $request->user() ? $request->user()->id : 'guest',
                    'created_at' => now()->toISOString(),
                ],
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du PaymentIntent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function confirmPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_intent_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            return response()->json([
                'status' => $paymentIntent->status,
                'payment_intent' => $paymentIntent,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la vérification du paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}