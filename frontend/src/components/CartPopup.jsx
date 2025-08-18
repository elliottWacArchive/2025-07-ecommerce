import Link from "next/link";
import { useCart } from "../contexts/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPopup({ isVisible, onMouseEnter, onMouseLeave }) {
    const { cart, removeFromCart, getCartTotal } = useCart();

    if (!isVisible) return null;

    return (
        <div
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Header du popup */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Votre panier
                </h3>
                <p className="text-sm text-gray-600">
                    {cart.length} article{cart.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Contenu du panier */}
            <div className="max-h-64 overflow-y-auto">
                {cart.length > 0 ? (
                    <div className="p-4 space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                {/* Image du produit */}
                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ShoppingBag className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>

                                {/* Informations du produit */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {item.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Quantité: {item.quantity}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.price}€
                                    </p>
                                </div>

                                {/* Bouton supprimer */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Supprimer du panier"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Votre panier est vide</p>
                    </div>
                )}
            </div>

            {/* Footer avec total et bouton */}
            {cart.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">
                            {getCartTotal().toFixed(2)}€
                        </span>
                    </div>
                    <Link href="/cart">
                        <button className="w-full bg-[#FC87D2] text-white py-2 px-4 rounded-lg hover:bg-[#e078ba] transition-colors font-medium">
                            Voir le panier
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
} 