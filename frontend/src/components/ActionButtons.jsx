"use client";

import { useCart } from "../contexts/CartContext";
import { useState } from "react";

export default function ActionButtons({ product, selectedCapacity }) {
    const { addToCart, loading } = useCart();
    const [showAlert, setShowAlert] = useState(false);

    const handleAddToCart = async () => {
        if (product.stock === 0) {
            alert("Ce produit n'est plus disponible en stock.");
            return;
        }
        
        // Calculer le prix selon la contenance
        const calculatePrice = (basePrice, capacity) => {
            const capacityMultipliers = {
                "30ml": 0.7,
                "50ml": 1.0,
                "100ml": 1.8
            };
            return (basePrice * capacityMultipliers[capacity]).toFixed(2);
        };

        const currentPrice = calculatePrice(product.price, selectedCapacity);
        
        // Créer un produit modifié avec la contenance et le prix calculé
        const productWithCapacity = {
            ...product,
            price: parseFloat(currentPrice),
            capacity: selectedCapacity,
            originalPrice: product.price, // Garder le prix original pour référence
            displayName: `${product.name} (${selectedCapacity})`
        };

        const result = await addToCart(productWithCapacity, 1);
        
        if (result.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } else {
            alert(result.message);
        }
    };

    const isOutOfStock = product.stock === 0;

    return (
        <>
            {showAlert && (
                <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
                    {product.name} ({selectedCapacity}) ajouté au panier ✅
                </div>
            )}

            <div className="space-y-6">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || loading}
                    className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors ${
                        isOutOfStock || loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-[#FC87D2] text-white hover:bg-gray-800'
                    }`}
                >
                    {loading 
                        ? 'Ajout en cours...' 
                        : isOutOfStock 
                            ? 'Stock épuisé' 
                            : 'Ajouter au panier'
                    }
                </button>
            </div>
        </>
    );
}
