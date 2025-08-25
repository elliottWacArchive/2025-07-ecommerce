<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_intent_id',
        'total_price',
        'status',
        'currency',
        'customer_name',
        'customer_email',
        'customer_address',
        'shipping_cost',
        'shipping_method',
        'delivery_time',
        'items',
        'payment_status',
    ];

    protected $casts = [
        'items' => 'array',
        'total_price' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
