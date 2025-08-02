"use client";

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
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const id = useParams();

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

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            if (existing.quantity < product.stock) {
                existing.quantity += 1;
            } else {
                alert("Stock maximum atteint !");
                return;
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
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

    const productImages = [product.image].filter(Boolean);

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
                    <Breadcrumb productName={product.name} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Galerie d'images */}
                        <ImageGallery
                            images={productImages}
                            selectedImage={selectedImage}
                            onImageSelect={setSelectedImage}
                            productName={product.name}
                        />

                        {/* Informations produit */}
                        <div className="space-y-6">
                            <ProductInfo product={product} />
                            <ActionButtons
                                product={product}
                                onAdd={() => {
                                    setShowAlert(true);
                                    setTimeout(() => setShowAlert(false), 2000);
                                }}
                            />
                            <NotesOlfactives />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
