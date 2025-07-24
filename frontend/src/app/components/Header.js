import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:text-indigo-400 transition">
                Mon E-Commerce
            </Link>
            <div>
                <span className="text-lg">🛒 Panier</span>
            </div>
        </header>
    );
} 