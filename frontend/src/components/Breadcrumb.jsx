import Link from "next/link";

export default function Breadcrumb({ productName }) {
    return (
        <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-indigo-600">Accueil</Link></li>
                <li>/</li>
                <li><Link href="/products" className="hover:text-indigo-600">Produits </Link></li>
                <li>/</li>
                <li className="text-gray-900 font-medium">{productName}</li>
            </ol>
        </nav>
    );
} 