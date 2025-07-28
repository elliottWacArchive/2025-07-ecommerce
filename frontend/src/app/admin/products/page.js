"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
    image: "",
  });

  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token || !isAdmin) {
      router.push("/dashboard");
      return;
    }
  }, [user, token, isAdmin, authLoading, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Produit ajouté avec succès !");
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || "Erreur lors de l'ajout du produit");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <p>Chargement...</p>;
  }

  if (!user || !isAdmin) {
    return <p>Accès non autorisé</p>;
  }

  return (
    <div className="admin-products">
      <h1>Ajouter un produit</h1>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom du produit :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Prix :</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="stock">Stock :</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="brand">Marque :</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="category">Catégorie :</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="image">Image URL :</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Ajout en cours..." : "Ajouter Produit"}
        </button>
      </form>
    </div>
  );
}
