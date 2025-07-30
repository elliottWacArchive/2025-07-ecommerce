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
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        brand: "",
        category_id: "",
        image: "",
    });

    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:8000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) =>
                console.error("Erreur sur le chargement des produits:", err)
            );
    }, []);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/api/admin/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setCategories(data))
                .catch((err) =>
                    console.error(
                        "Erreur sur le chargement des catégories:",
                        err
                    )
                );
        }
    }, [token]);

    useEffect(() => {
        if (authLoading) return;

        if (!user || !token || !isAdmin) {
            router.push("/dashboard");
            return;
        }
    }, [user, token, isAdmin, authLoading, router]);

    const handleOpenModal = () => {
        setIsEditMode(false);
        setEditingProductId(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            brand: "",
            category_id: "",
            image: "",
        });
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setIsEditMode(true);
        setEditingProductId(product.id);
        setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            brand: product.brand || "",
            category_id: product.category_id || "",
            image: product.image || "",
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingProductId(null);
        setMessage("");
    };

    const handleDeleteProduct = async (productId) => {
        if (
            !window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")
        ) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const productsResponse = await fetch(
                    "http://localhost:8000/api/products"
                );
                if (productsResponse.ok) {
                    const updatedProducts = await productsResponse.json();
                    setProducts(updatedProducts);
                }
                setMessage("Produit supprimé avec succès !");

                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                const errorData = await response.json();
                setMessage(
                    errorData.message || "Erreur lors de la suppression"
                );
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            setMessage("Erreur de connexion lors de la suppression");
        }
    };

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

        console.log("Token utilisé:", token);
        console.log("Données envoyées:", formData);

        try {
            const url = isEditMode
                ? `http://localhost:8000/api/admin/products/${editingProductId}`
                : "http://localhost:8000/api/admin/products";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            console.log("Statut de la réponse:", response.status);

            if (response.ok) {
                const successMessage = isEditMode
                    ? "Produit modifié avec succès !"
                    : "Produit ajouté avec succès !";
                setMessage(successMessage);
                handleCloseModal();

                const productsResponse = await fetch(
                    "http://localhost:8000/api/products"
                );
                if (productsResponse.ok) {
                    const updatedProducts = await productsResponse.json();
                    setProducts(updatedProducts);
                }

                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                const errorText = await response.text();
                console.log("Erreur de réponse:", errorText);
                try {
                    const error = JSON.parse(errorText);
                    setMessage(
                        error.message ||
                            `Erreur lors de ${
                                isEditMode ? "la modification" : "l'ajout"
                            } du produit`
                    );
                } catch {
                    setMessage(
                        `Erreur ${response.status}: ${response.statusText}`
                    );
                }
            }
        } catch (error) {
            console.error("Erreur complète:", error);
            setMessage(`Erreur de connexion au serveur: ${error.message}`);
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

            {message && (
                <div
                    className={`notification ${
                        message.includes("succès") ? "success" : "error"
                    }`}
                >
                    {message}
                </div>
            )}

            <button onClick={handleOpenModal} className="add-product-btn">
                Ajouter un nouveau produit
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>
                                {isEditMode
                                    ? "Modifier le produit"
                                    : "Ajouter un produit"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="close-btn"
                            >
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
                                <label htmlFor="description">
                                    Description :
                                </label>
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
                                <label htmlFor="category_id">Catégorie :</label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Sélectionner une catégorie
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
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
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                >
                                    Annuler
                                </button>
                                <button type="submit" disabled={loading}>
                                    {loading
                                        ? isEditMode
                                            ? "Modification en cours..."
                                            : "Ajout en cours..."
                                        : isEditMode
                                        ? "Modifier Produit"
                                        : "Ajouter Produit"}
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
                                    <p>
                                        Marque:{" "}
                                        {product.brand || "Non spécifié"}
                                    </p>
                                    <p>
                                        Catégorie:{" "}
                                        {product.category?.name ||
                                            "Non spécifié"}
                                    </p>
                                    <div className="product-actions">
                                        <button
                                            onClick={() =>
                                                handleEditProduct(product)
                                            }
                                            className="edit-btn"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteProduct(product.id)
                                            }
                                            className="delete-btn"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
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
