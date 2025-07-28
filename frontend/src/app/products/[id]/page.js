"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import ImageGallery from "../../components/ImageGallery";
import ProductInfo from "../../components/ProductInfo";
import QuantitySelector from "../../components/QuantitySelector";
import ActionButtons from "../../components/ActionButtons";

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const id = useParams();
    
    useEffect(() => {
        async function fetchProduct() {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8000/api/products/${id.id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id?.id) {
            fetchProduct();
        }
    }, [id]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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

    const productImages = [
        product.image
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Breadcrumb productName={product.name} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <ImageGallery 
                            images={productImages}
                            selectedImage={selectedImage}
                            onImageSelect={setSelectedImage}
                            productName={product.name}
                        />

                        {/* Informations produit */}
                        <div className="space-y-6">
                            <ProductInfo product={product} />
                            
                            <QuantitySelector 
                                quantity={quantity} 
                                onQuantityChange={handleQuantityChange} 
                            />

                            <ActionButtons 
                                product={product} 
                                quantity={quantity} 
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}