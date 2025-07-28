export default function Breadcrumb({ productName }) {
    return (
        <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li><a href="/" className="hover:text-indigo-600">Accueil</a></li>
                <li>/</li>
                <li><a href="/products" className="hover:text-indigo-600">Produits</a></li>
                <li>/</li>
                <li className="text-gray-900 font-medium">{productName}</li>
            </ol>
        </nav>
    );
} 