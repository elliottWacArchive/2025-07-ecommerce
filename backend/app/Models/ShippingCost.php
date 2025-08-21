<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingCost extends Model
{
    use HasFactory;

    protected $fillable = [
        'country',
        'delivery_method',
        'cost',
        'min_order_amount',
        'max_order_amount',
        'estimated_delivery_days',
        'is_active'
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_order_amount' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public static function calculateShippingCost($country, $deliveryMethod, $orderAmount)
    {
        $shippingOption = self::where('country', $country)
            ->where('delivery_method', $deliveryMethod)
            ->where('is_active', true)
            ->where('min_order_amount', '<=', $orderAmount)
            ->where(function ($query) use ($orderAmount) {
                $query->whereNull('max_order_amount')
                    ->orWhere('max_order_amount', '>=', $orderAmount);
            })
            ->first();

        return $shippingOption ? $shippingOption->cost : null;
    }

    public static function getAvailableOptions($country, $orderAmount = 0)
    {
        return self::where('country', $country)
            ->where('is_active', true)
            ->where('min_order_amount', '<=', $orderAmount)
            ->where(function ($query) use ($orderAmount) {
                $query->whereNull('max_order_amount')
                    ->orWhere('max_order_amount', '>=', $orderAmount);
            })
            ->orderBy('cost', 'asc')
            ->get();
    }

    public static function getAvailableCountries()
    {
        return self::where('is_active', true)
            ->distinct()
            ->pluck('country')
            ->sort()
            ->values();
    }

    public static function getDeliveryMethods($country)
    {
        return self::where('country', $country)
            ->where('is_active', true)
            ->distinct()
            ->pluck('delivery_method')
            ->sort()
            ->values();
    }
}