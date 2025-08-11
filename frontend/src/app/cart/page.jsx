"use client";

import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

export default function Cart() {
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

    const total = getCartTotal();

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
                                        className="border border-[#CECDFF] rounded-xl p-6 bg-gray-50"
                                    >
                                        <div className="flex items-center space-x-6">
                                            {item.image && (
                                                <img
                                                    src={`http://localhost:8000/storage/${item.image}`}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            )}

                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    {item.brand} - {item.name}
                                                </h3>
                                                <p className="text-gray-600 mt-1">
                                                    Prix unitaire : {item.price}
                                                    €
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Stock disponible :{" "}
                                                    {item.stock}
                                                </p>
                                            </div>

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
                                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                                    />
                                                </div>

                                                <div className="text-right">
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
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t border-[#CECDFF] pt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-2xl font-bold text-[#C395E4]">
                                            Total : {total.toFixed(2)} €
                                        </div>
                                        <button className="bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                                            Procéder au paiement
                                        </button>
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
