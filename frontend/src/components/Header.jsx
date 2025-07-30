import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
// import { ShoppingCart } from "lucide-react";

export default function Header() {
    const { user, logout, loading } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-8">
                        <a href="/">
                            <img className="h-10" src="/logo-crop.png" alt="" />
                        </a>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/actualites"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Actualités
                        </Link>
                        <Link
                            href="/parfum"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Parfum
                        </Link>
                        <Link
                            href="/corps"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Corps
                        </Link>
                        <Link
                            href="/visage"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Visage
                        </Link>
                        <Link
                            href="/maquillage"
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
                        <Link href="/login">
                            <button className="px-4 bg-[#9e90ed] py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                                {user ? (
                                    <span onClick={handleLogout}>
                                        Se déconnecter
                                    </span>
                                ) : (
                                    <span>Se connecter</span>
                                )}{" "}
                            </button>
                        </Link>
                        <Link href="/cart">
                            <button className="px-4 py-2 bg-[#FC87D2] text-white rounded-lg hover:bg-gray-800 font-medium">
                                Panier
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
