"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get("http://localhost:8000/api/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des produits :", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-96 text-lg font-semibold">Chargement des produits...</div>;
    }

    return (
        <>
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-10">Nos produits</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col items-center transition" key={product.id}>
                            {product.image && (
                                <img src={product.image} alt={product.name} className="w-32 h-32 object-contain mb-4 rounded" />
                            )}
                            <h2 className="text-lg font-semibold mb-2 text-center">{product.name}</h2>
                            <p className="text-indigo-600 font-bold mb-2">{product.price} €</p>
                            <Link href={`/products/${product.id}`} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Voir plus</Link>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
