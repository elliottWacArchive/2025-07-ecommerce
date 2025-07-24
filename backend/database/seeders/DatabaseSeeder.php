<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Products;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
            Products::factory()->count(10)->create();
    }
}
