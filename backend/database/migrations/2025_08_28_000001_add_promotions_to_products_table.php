<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedTinyInteger('discount_percentage')->nullable()->after('price');
            $table->timestamp('promo_starts_at')->nullable()->after('discount_percentage');
            $table->timestamp('promo_ends_at')->nullable()->after('promo_starts_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['discount_percentage', 'promo_starts_at', 'promo_ends_at']);
        });
    }
}; 