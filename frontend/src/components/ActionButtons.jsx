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
            <button className="w-full bg-[#FC87D2] text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                {isOutOfStock ? "Stock épuisé" : "Ajouter au panier"}
            </button>
        </div>
    );
}
