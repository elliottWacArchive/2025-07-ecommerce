export default function ProductInfo({ product }) {
    // Fonction pour déterminer le statut du stock
    const getStockStatus = (stock) => {
        if (stock === 0) {
            return {
                text: "Stock épuisé",
                color: "text-red-600",
                bgColor: "bg-red-100",
                borderColor: "border-red-200"
            };
        } else if (stock <= 10) {
            return {
                text: "Quantités limitées",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
                borderColor: "border-orange-200"
            };
        } else {
            return {
                text: "En stock",
                color: "text-green-600",
                bgColor: "bg-green-100",
                borderColor: "border-green-200"
            };
        }
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <div className="space-y-6">
            {/* Titre du produit */}
            <h1 className="text-3xl font-bold text-gray-900">{product.brand} - {product.name}</h1>
            
            {/* Statut du stock */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bgColor} ${stockStatus.borderColor} border`}>
                <span className={stockStatus.color}>{stockStatus.text}</span>
            </div>
            
            {/* Prix avec badge */}
            <div className="space-y-2">
                <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    Prix
                </div>
                <div className="text-4xl font-bold text-gray-900">{product.price} €</div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">Description</div>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Contenance */}
            <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">Contenance</div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                    <option value="">Sélectionner une contenance</option>
                    <option value="30ml">30ml</option>
                    <option value="50ml">50ml</option>
                    <option value="100ml">100ml</option>
                </select>
            </div>
        </div>
    );
} 