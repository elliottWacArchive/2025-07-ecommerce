<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Products>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true), // ex: "Parfum Homme"
            'description' => $this->faker->paragraph(), // Une petite description
            'price' => $this->faker->randomFloat(2, 10, 200), // ex: 129.99
            'stock' => $this->faker->numberBetween(0, 100), // quantité en stock
            'brand' => $this->faker->company(), // ex: "Chanel"
        ];
    }
}
