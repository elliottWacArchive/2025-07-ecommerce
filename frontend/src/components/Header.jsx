import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import CartPopup from "./CartPopup";
// import { ShoppingCart } from "lucide-react";

export default function Header() {
    const { user, logout, loading } = useAuth();
    const { getCartItemsCount } = useCart();
    const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const handleCartMouseEnter = () => {
        setIsCartPopupVisible(true);
    };

    const handleCartMouseLeave = () => {
        setIsCartPopupVisible(false);
    };

    if (loading) {
        return (
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
                <div className="row-start-2">Chargement...</div>
            </div>
        );
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-8">
                        <Link href="/shop">
                            <img className="h-10" src="/logo-crop.png" alt="" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/category?category=Actualites"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Actualités
                        </Link>
                        <Link
                            href="/category?category=Parfums"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Parfums
                        </Link>
                        <Link
                            href="/category?category=Soins"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Soins
                        </Link>
                        <Link
                            href="/category?category=Coffrets"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Coffrets
                        </Link>
                        <Link
                            href="/category?category=Maquillage"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Maquillage
                        </Link>
                        <Link
                            href="/a-propos"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            À propos
                        </Link>
                        <Link
                            href="/favoris"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Favoris
                        </Link>
                    </nav>

                    {/* Boutons d'action */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 bg-[#9e90ed] py-2 border border-gray-300 rounded-lg text-white cursor-pointer hover:bg-[#8678d1] font-medium"
                                >
                                    Se déconnecter
                                </button>
                                <Link href="/dashboard">
                                    <button className="px-4 bg-[#9e90ed] py-2 border border-gray-300 rounded-lg text-white cursor-pointer hover:bg-[#8678d1] font-medium">
                                        Mon compte
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <Link href="/login">
                                <button className="px-4 bg-[#9e90ed] py-2 border border-gray-300 rounded-lg text-white cursor-pointer hover:bg-[#8678d1] font-medium">
                                    Se connecter
                                </button>
                            </Link>
                        )}
                        
                        {/* Bouton panier avec popup */}
                        <div className="relative">
                            <Link href="/cart">
                                <button 
                                    className="relative px-4 py-2 bg-[#FC87D2] text-white rounded-lg cursor-pointer hover:bg-[#e078ba] font-medium"
                                    onMouseEnter={handleCartMouseEnter}
                                    onMouseLeave={handleCartMouseLeave}
                                >
                                    Panier
                                    {getCartItemsCount() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {getCartItemsCount()}
                                        </span>
                                    )}
                                </button>
                            </Link>
                            
                            {/* Popup du panier */}
                            <CartPopup 
                                isVisible={isCartPopupVisible}
                                onMouseEnter={handleCartMouseEnter}
                                onMouseLeave={handleCartMouseLeave}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
