import StockStatus from "./StockStatus";

export default function ProductInfo({ product, selectedCapacity, onCapacityChange, calculatePrice }) {
    const basePriceForCapacity = calculatePrice(product.price, selectedCapacity);
    const promoBase = product.is_on_promo ? product.current_price : product.price;
    const promoPriceForCapacity = calculatePrice(promoBase, selectedCapacity);

    return (
        <div className="space-y-6">
            {/* Titre du produit */}
            <h1 className="text-3xl font-bold text-gray-900">{product.brand} - {product.name}</h1>
            
            {/* Statut du stock */}
            <StockStatus stock={product.stock} />
            
            {/* Prix avec badge */}
            <div className="space-y-2">
                <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    Prix
                </div>
                {product.is_on_promo ? (
                    <div className="flex items-baseline gap-3">
                        <div className="text-4xl font-bold text-green-700">€{promoPriceForCapacity}</div>
                        <div className="text-2xl text-gray-400 line-through">€{basePriceForCapacity}</div>
                        {product.discount_percentage && (
                            <span className="text-sm font-semibold text-red-600">-{product.discount_percentage}%</span>
                        )}
                    </div>
                ) : (
                    <div className="text-4xl font-bold text-gray-900">€{basePriceForCapacity}</div>
                )}
                {selectedCapacity !== "50ml" && (
                    <p className="text-sm text-gray-500">
                        Prix de base: €{product.price} (50ml)
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">Description</div>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Contenance */}
            <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">Contenance</div>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    value={selectedCapacity}
                    onChange={(e) => onCapacityChange(e.target.value)}
                >
                    <option value="30ml">30ml - €{calculatePrice(product.is_on_promo ? product.current_price : product.price, "30ml")}</option>
                    <option value="50ml">50ml - €{calculatePrice(product.is_on_promo ? product.current_price : product.price, "50ml")}</option>
                    <option value="100ml">100ml - €{calculatePrice(product.is_on_promo ? product.current_price : product.price, "100ml")}</option>
                </select>
                <p className="text-xs text-gray-500">
                    Sélectionnez la contenance pour voir le prix correspondant
                </p>
            </div>
        </div>
    );
} 