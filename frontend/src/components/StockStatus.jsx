export default function StockStatus({ stock }) {
    // Fonction pour déterminer le statut du stock
    const getStockStatus = (stockQuantity) => {
        if (stockQuantity === 0) {
            return {
                text: "Stock épuisé",
                color: "text-red-600",
                bgColor: "bg-red-100",
                borderColor: "border-red-200"
            };
        } else if (stockQuantity <= 10) {
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

    const status = getStockStatus(stock);

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.borderColor} border`}>
            <span className={status.color}>{status.text}</span>
        </div>
    );
} 