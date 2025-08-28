<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'category_id',
        'subcategory_id',      
        'sub_subcategory_id', 
        'brand',
        'images',
        'image',
        'views',
        'discount_percentage',
        'promo_starts_at',
        'promo_ends_at',
    ];

    protected $casts = [
        'images' => 'array',
        'promo_starts_at' => 'datetime',
        'promo_ends_at' => 'datetime',
    ];

    // Accesseur pour obtenir toutes les images
    public function getAllImagesAttribute()
    {
        $images = $this->images ?? [];
        if ($this->image && !in_array($this->image, $images)) {
            array_unshift($images, $this->image);
        }
        return $images;
    }

    public function getIsOnPromoAttribute(): bool
    {
        if (!$this->discount_percentage) {
            return false;
        }
        $now = now();
        if ($this->promo_starts_at && $now->lt($this->promo_starts_at)) {
            return false;
        }
        if ($this->promo_ends_at && $now->gt($this->promo_ends_at)) {
            return false;
        }
        return true;
    }

    public function getCurrentPriceAttribute(): float
    {
        if ($this->is_on_promo) {
            return round($this->price * (1 - ($this->discount_percentage / 100)), 2);
        }
        return (float) $this->price;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function subSubcategory()
    {
        return $this->belongsTo(SubSubcategory::class);
    }
}
