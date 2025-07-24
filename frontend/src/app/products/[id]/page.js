"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "../../components/Header";

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const id = useParams();
    
    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id.id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }
        if (id?.id) {
            fetchProduct();
        }
    }, [id]);
    
    if (!product) {
        return <div className="flex justify-center items-center h-96 text-lg font-semibold">Chargement...</div>;
    }

    return (
        <>
            <Header />
            <main className="flex justify-center items-center min-h-[60vh] px-4 py-10">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
                    {product.image && (
                        <img src={product.image} alt={product.name} className="w-40 h-40 object-contain mb-6 rounded" />
                    )}
                    <h1 className="text-2xl font-bold mb-4 text-center">{product.name}</h1>
                    <p className="text-gray-700 mb-4 text-center">{product.description}</p>
                    <p className="text-indigo-600 font-bold text-lg mb-2">Prix : {product.price} €</p>
                </div>
            </main>
        </>
    );
}