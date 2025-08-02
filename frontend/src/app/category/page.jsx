"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/by-category?category=${category}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur :", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Chargement...</p>;

  if (!products.length) return <p>Aucun produit trouvé pour la catégorie "{category}"</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Catégorie : {category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
            <p>{item.price} €</p>
            <Link href={`/products/${item.id}`} className="text-blue-500 hover:underline">
              Voir le produit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
