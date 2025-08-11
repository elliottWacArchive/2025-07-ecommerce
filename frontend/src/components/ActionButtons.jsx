"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function ActionButtons({ product }) {
    const [showAlert, setShowAlert] = useState(false);
    const { addToCart, loading } = useCart();

    const handleAddToCart = async () => {
        if (product.stock === 0) {
            return;
        }

        const result = await addToCart(product, 1);

        if (result.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        } else {
            alert(result.message);
        }
    };

    const isOutOfStock = product.stock === 0;

    return (
        <>
            {showAlert && (
                <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
                    Article ajouté au panier ✅
                </div>
            )}

            <div className="space-y-6">
                <button
                    className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors ${
                        isOutOfStock
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#FC87D2] text-white hover:bg-[#f56dc0]"
                    }`}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || loading}
                >
                    {loading
                        ? "Ajout en cours..."
                        : isOutOfStock
                        ? "Stock épuisé"
                        : "Ajouter au panier"}
                </button>
            </div>
        </>
    );
}
