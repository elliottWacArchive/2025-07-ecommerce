export default function QuantitySelector({ quantity, onQuantityChange }) {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            onQuantityChange(newQuantity);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Quantité:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                    -
                </button>
                <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
} 