"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ActionButtons from "@/components/ActionButtons";
import NotesOlfactives from "@/components/NotesOlfactives";

export default function ProductDetails() {
    const { user, token } = useAuth();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedCapacity, setSelectedCapacity] = useState("50ml");
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const id = useParams();
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        async function fetchRelated() {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/products/${id.id}/related`
                );
                setRelatedProducts(res.data);
            } catch (err) {
                console.error("Erreur chargement produits liés:", err);
            }
        }
        if (id?.id) fetchRelated();
    }, [id]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/products/${id.id}/reviews`
                );
                setReviews(res.data);
            } catch (e) {
                console.error("Erreur chargement avis :", e);
            }
        }
        if (id?.id) fetchReviews();
    }, [id]);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `http://localhost:8000/api/products/${id.id}`
                );
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id?.id) {
            fetchProduct();
        }
    }, [id]);

    const calculatePrice = (basePrice, capacity) => {
        const capacityMultipliers = {
            "30ml": 0.7, // 30ml = 70% du prix de base
            "50ml": 1.0, // 50ml = prix de base (100%)
            "100ml": 1.8, // 100ml = 180% du prix de base
        };

        return (basePrice * capacityMultipliers[capacity]).toFixed(2);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-96 text-lg font-semibold text-gray-600">
                    Produit non trouvé
                </div>
            </>
        );
    }

    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : product.image
            ? [product.image]
            : [];

    return (
        <>
            <Header />

            {showAlert && (
                <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
                    Article ajouté au panier ✅
                </div>
            )}

            <main className="min-h-screen bg-[#CECDFF]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Breadcrumb
                        productName={product.name}
                        categoryName={product.category?.name}
                        subcategoryName={product.subcategory?.name}
                        subSubcategoryName={product.sub_subcategory?.name}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <ImageGallery
                            images={productImages}
                            selectedImage={selectedImage}
                            onImageSelect={setSelectedImage}
                            productName={product.name}
                        />

                        <div className="space-y-6">
                            <ProductInfo
                                product={product}
                                selectedCapacity={selectedCapacity}
                                onCapacityChange={setSelectedCapacity}
                                calculatePrice={calculatePrice}
                            />

                            <ActionButtons
                                product={product}
                                selectedCapacity={selectedCapacity}
                            />

                            <NotesOlfactives />
                        </div>
                        {relatedProducts.length > 0 && (
                            <div className="mt-16 lg:col-span-2">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-2">
                                    Ces produits pourraient aussi vous
                                    intéresser
                                </h2>
                                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                    {relatedProducts.map((prod) => {
                                        const getProductImageUrl = (
                                            product
                                        ) => {
                                            let imageSrc = null;

                                            if (
                                                product.images &&
                                                product.images.length > 0
                                            ) {
                                                imageSrc = product.images[0];
                                            } else if (product.image) {
                                                imageSrc = product.image;
                                            }

                                            if (!imageSrc) return null;

                                            if (imageSrc.startsWith("http")) {
                                                return imageSrc;
                                            }

                                            if (imageSrc.startsWith("/")) {
                                                return `http://localhost:8000${imageSrc}`;
                                            }

                                            return `http://localhost:8000/products/${imageSrc}`;
                                        };

                                        const imageUrl =
                                            getProductImageUrl(prod);

                                        return (
                                            <div
                                                key={prod.id}
                                                className="min-w-[200px] bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex-shrink-0"
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={prod.name}
                                                        className="w-full h-40 object-cover rounded-md"
                                                        onError={(e) => {
                                                            e.target.style.display =
                                                                "none";
                                                            e.target.parentElement.innerHTML =
                                                                '<div class="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center"><div class="text-center"><svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-gray-400 text-xs">Image</p></div></div>';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                                                        <div className="text-center">
                                                            <svg
                                                                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        1
                                                                    }
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            <p className="text-gray-400 text-xs">
                                                                Pas d'image
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                <h3 className="mt-3 font-medium text-gray-800 truncate">
                                                    {prod.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {prod.price} €
                                                </p>
                                                <a
                                                    href={`/products/${prod.id}`}
                                                    className="mt-2 inline-block bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                                                >
                                                    Voir
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="mt-12 lg:col-span-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-2">
                                Avis des clients
                            </h2>

                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500 text-lg">
                                                        {"⭐".repeat(
                                                            review.rating
                                                        )}
                                                    </span>
                                                    <span className="ml-3 font-medium text-gray-700">
                                                        {review.user?.name ||
                                                            "Utilisateur"}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(
                                                        review.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-gray-700 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 italic">
                                        Aucun avis pour ce produit.
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Laissez un avis
                                </h3>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        try {
                                            await axios.post(
                                                `http://localhost:8000/api/products/${id.id}/reviews`,
                                                {
                                                    rating: newReview.rating,
                                                    comment: newReview.comment,
                                                },
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                }
                                            );
                                            setNewReview({
                                                rating: 5,
                                                comment: "",
                                            });
                                            const res = await axios.get(
                                                `http://localhost:8000/api/products/${id.id}/reviews`
                                            );
                                            setReviews(res.data);
                                        } catch (err) {
                                            console.error(
                                                "Erreur ajout avis :",
                                                err
                                            );
                                        }
                                    }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Note :
                                        </label>
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) =>
                                                setNewReview({
                                                    ...newReview,
                                                    rating: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <option key={n} value={n}>
                                                    {n} étoile{n > 1 && "s"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Commentaire :
                                        </label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) =>
                                                setNewReview({
                                                    ...newReview,
                                                    comment: e.target.value,
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                                            rows="4"
                                            placeholder="Écrivez votre avis ici..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#FC87D2] hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                                    >
                                        Ajouter un avis
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </main>
        </>
    );
}
