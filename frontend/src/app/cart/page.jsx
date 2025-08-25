"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
    const [shippingCost, setShippingCost] = useState(null);
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
    } = useCart();

    const handleUpdateQuantity = async (id, quantity, stock) => {
        const finalQuantity = Math.min(Math.max(quantity, 1), stock);
        await updateQuantity(id, finalQuantity);
    };

    const handleRemoveFromCart = async (id) => {
        await removeFromCart(id);
    };

    const handleClearCart = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
            await clearCart();
        }
    };

    const handleShippingChange = (shipping) => {
        setShippingCost(shipping);
    };

    const getShippingCost = () => {
        if (!shippingCost || !shippingCost.cost) return 0;
        return parseFloat(shippingCost.cost) || 0;
    };

    const total = getCartTotal();

    const getTotalWithShipping = () => {
        return total + getShippingCost();
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#CECDFF] py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-[#C395E4]">
                                Votre Panier
                            </h1>
                            {cart.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Vider le panier
                                </button>
                            )}
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center py-16">
                                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl text-gray-600 mb-4">
                                    Votre panier est vide
                                </p>
                                <a
                                    href="/shop"
                                    className="bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                                >
                                    Continuer vos achats
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-[#CECDFF] rounded-xl p-6 bg-gray-50 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center space-x-6">
                                            {/* Image produit */}
                                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                {item.image ? (
                                                    <img
                                                        src={`http://localhost:8000${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ShoppingBag className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Infos produit */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-semibold text-gray-800 truncate">
                                                    {item.brand &&
                                                        `${item.brand} - `}
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-600 mt-1">
                                                    Prix unitaire :{" "}
                                                    <span className="font-medium">
                                                        {item.price}€
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Stock disponible :{" "}
                                                    <span className="font-medium">
                                                        {item.stock}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Contrôles */}
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Quantité :
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.stock}
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleUpdateQuantity(
                                                                item.id,
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ),
                                                                item.stock
                                                            )
                                                        }
                                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                                                    />
                                                </div>

                                                <div className="text-right min-w-[80px]">
                                                    <p className="text-lg font-semibold text-gray-800">
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                        €
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleRemoveFromCart(
                                                            item.id
                                                        )
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Résumé */}
                                <div className="border-t border-[#CECDFF] pt-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-lg">
                                            <span>Sous-total :</span>
                                            <span className="font-semibold">
                                                {total.toFixed(2)} €
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-lg">
                                            <span>Frais de port :</span>
                                            <span className="font-semibold">
                                                {shippingCost
                                                    ? getShippingCost() > 0
                                                        ? `${getShippingCost().toFixed(
                                                              2
                                                          )} €`
                                                        : "Gratuit"
                                                    : "À calculer"}
                                            </span>
                                        </div>

                                        <div className="border-t pt-3">
                                            <div className="flex justify-between items-center">
                                                <div className="text-2xl font-bold text-[#C395E4]">
                                                    Total :{" "}
                                                    {getTotalWithShipping().toFixed(
                                                        2
                                                    )}{" "}
                                                    €
                                                </div>

                                                <Link
                                                    href="/pay"
                                                    className="bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                                                >
                                                    Procéder au paiement
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
