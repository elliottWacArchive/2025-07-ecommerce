export default function ActionButtons({ product }) {
    // const handleAddToCart = () => {
    //     if (product.stock === 0) {
    //         alert("Ce produit n'est plus disponible en stock.");
    //         return;
    //     }
        
    //     alert(`${product.name} ajouté au panier !`);
    // };

    const isOutOfStock = product.stock === 0;

    return (
        <div className="space-y-6">
            <button
                // onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors ${
                    isOutOfStock 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#FC87D2] text-white hover:bg-gray-800'
                }`}
            >
                {isOutOfStock ? 'Stock épuisé' : 'Ajouter au panier'}
            </button>
        </div>
    );
} 