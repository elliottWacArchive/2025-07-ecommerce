"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import "./page.css";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Erreur sur le chargement des produits:", err)
      );
  }, []);

  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token || !isAdmin) {
      router.push("/dashboard");
      return;
    }
  }, [user, token, isAdmin, authLoading, router]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
        handleCloseModal();
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
      <h1>Gestion des produits</h1>

      <button onClick={handleOpenModal} className="add-product-btn">
        Ajouter un nouveau produit
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Ajouter un produit</h2>
              <button onClick={handleCloseModal} className="close-btn">
                &times;
              </button>
            </div>

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

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Ajout en cours..." : "Ajouter Produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="product-list">
        <h2>Liste des produits</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Prix: {product.price}€</p>
                  <p>Stock: {product.stock}</p>
                  <p>Marque: {product.brand || "Non spécifié"}</p>
                  <p>Catégorie: {product.category || "Non spécifié"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun produit disponible.</p>
        )}
      </div>
    </div>
  );
}
