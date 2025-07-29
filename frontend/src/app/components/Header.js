import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Header() {
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-[#C395E4] text-white shadow">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:text-indigo-400 transition">
                Mon E-Commerce
            </Link>
            <button className="p-4 border-2 border-gray-600 rounded-xl hover:border-gray-400 transition-colors">
                <svg className="w-6 h-6 text-gray-600 hover:border-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <ShoppingCart/>
                </svg>
            </button>
        </header>
    );
} 