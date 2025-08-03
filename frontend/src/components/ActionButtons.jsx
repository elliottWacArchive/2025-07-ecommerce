"use client";

import { useState } from "react";

export default function ActionButtons({ product, onAdd }) {
    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            if (existing.quantity < product.stock) {
                existing.quantity += 1;
            } else {
                alert("Stock maximum atteint !");
                return;
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        if (onAdd) onAdd(); // déclencher l'alerte depuis ProductsDetails
    };

    return (
        <div className="space-y-6">
            <button
                onClick={handleAddToCart}
                className="w-full bg-[#FC87D2] text-white font-semibold py-4 px-6 rounded-2xl hover:bg-pink-600 transition-colors"
            >
                Ajouter au panier
            </button>
        </div>
    );
}
