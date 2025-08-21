<?php

namespace App\Http\Controllers;

use App\Models\ShippingCost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShippingCostController extends Controller
{
    /**
     * Affiche la liste des frais de port (Admin)
     */
    public function index()
    {
        $shippingCosts = ShippingCost::orderBy('country')
            ->orderBy('delivery_method')
            ->orderBy('min_order_amount')
            ->get();

        return response()->json($shippingCosts);
    }

    /**
     * Crée un nouveau tarif de frais de port (Admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country' => 'required|string|max:255',
            'delivery_method' => 'required|string|max:255',
            'cost' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_order_amount' => 'nullable|numeric|min:0|gt:min_order_amount',
            'estimated_delivery_days' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $shippingCost = ShippingCost::create([
            'country' => $request->country,
            'delivery_method' => $request->delivery_method,
            'cost' => $request->cost,
            'min_order_amount' => $request->min_order_amount ?? 0,
            'max_order_amount' => $request->max_order_amount,
            'estimated_delivery_days' => $request->estimated_delivery_days,
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json([
            'message' => 'Frais de port créé avec succès',
            'shipping_cost' => $shippingCost
        ], 201);
    }

    /**
     * Affiche un tarif spécifique (Admin)
     */
    public function show($id)
    {
        $shippingCost = ShippingCost::find($id);

        if (!$shippingCost) {
            return response()->json(['message' => 'Frais de port non trouvé'], 404);
        }

        return response()->json($shippingCost);
    }

    /**
     * Met à jour un tarif de frais de port (Admin)
     */
    public function update(Request $request, $id)
    {
        $shippingCost = ShippingCost::find($id);

        if (!$shippingCost) {
            return response()->json(['message' => 'Frais de port non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'country' => 'string|max:255',
            'delivery_method' => 'string|max:255',
            'cost' => 'numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_order_amount' => 'nullable|numeric|min:0',
            'estimated_delivery_days' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $shippingCost->update($request->only([
            'country',
            'delivery_method',
            'cost',
            'min_order_amount',
            'max_order_amount',
            'estimated_delivery_days',
            'is_active'
        ]));

        return response()->json([
            'message' => 'Frais de port mis à jour avec succès',
            'shipping_cost' => $shippingCost
        ]);
    }

    public function destroy($id)
    {
        $shippingCost = ShippingCost::find($id);

        if (!$shippingCost) {
            return response()->json(['message' => 'Frais de port non trouvé'], 404);
        }

        $shippingCost->delete();

        return response()->json(['message' => 'Frais de port supprimé avec succès']);
    }

    public function calculate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country' => 'required|string',
            'delivery_method' => 'required|string',
            'order_amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $cost = ShippingCost::calculateShippingCost(
            $request->country,
            $request->delivery_method,
            $request->order_amount
        );

        if ($cost === null) {
            return response()->json([
                'message' => 'Aucun tarif de livraison trouvé pour ces critères'
            ], 404);
        }

        return response()->json([
            'shipping_cost' => $cost,
            'country' => $request->country,
            'delivery_method' => $request->delivery_method,
            'order_amount' => $request->order_amount
        ]);
    }

    public function getOptions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country' => 'required|string',
            'order_amount' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $orderAmount = $request->order_amount ?? 0;
        $options = ShippingCost::getAvailableOptions($request->country, $orderAmount);

        return response()->json([
            'country' => $request->country,
            'order_amount' => $orderAmount,
            'shipping_options' => $options
        ]);
    }


    public function getCountries()
    {
        $countries = ShippingCost::getAvailableCountries();

        return response()->json([
            'countries' => $countries
        ]);
    }

    public function getDeliveryMethods(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Pays requis',
                'errors' => $validator->errors()
            ], 422);
        }

        $methods = ShippingCost::getDeliveryMethods($request->country);

        return response()->json([
            'country' => $request->country,
            'delivery_methods' => $methods
        ]);
    }
}