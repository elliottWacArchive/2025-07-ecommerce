export default function ProductInfo({ product }) {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.brand} - {product.name}</h1>
            </div>

            <div className="bg-gradient-to-r from-[#C395E4] to-[#EE86C6] rounded-xl p-6">
                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{product.price} €</span>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
        </div>
    );
} 