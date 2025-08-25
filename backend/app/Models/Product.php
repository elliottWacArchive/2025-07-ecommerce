<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'images' => 'array',
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
