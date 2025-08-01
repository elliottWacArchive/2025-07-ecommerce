"use client";

import Image from "next/image";
import Link from "next/link";
// import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function Home() {
    // const { user, logout, loading } = useAuth();
    const [products, setProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    // const handleLogout = async () => {
    //     await logout();
    // };

    useEffect(() => {
        fetch("http://localhost:8000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) =>
                console.error("Erreur sur le chargement des produits:", err)
            );
    }, []);

    const handleAddToCart = (product) => {
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

    return (
        <div style={styles.page}>
            {showAlert && (
                <div style={styles.alert}>Article ajouté au panier  ✅</div>
            )}
            {/* <header style={styles.header}>
                <div style={styles.logoContainer}>
                    <span style={styles.logo}>[E]</span>
                    <span style={styles.brand}>PARFUMS</span>
                </div>
                <Link href="/cart" style={styles.cartLink}>
                    Voir le panier
                </Link>
                <Link href="/login" style={styles.cartLink}>
                    {user ? (
                        <span onClick={handleLogout}>Se déconnecter</span>
                    ) : (
                        <span>Se connecter</span>
                    )}
                </Link>
            </header> */}
            <Header />

            <section style={styles.selection}>
                <h2 style={styles.selectionTitle}>SÉLECTION COFFRET</h2>
                <div style={styles.grid}>
                    {products.map((item, index) => (
                        <div key={index} style={styles.coffret}>
                            <Link
                                href={`/products/${item.id}`}
                                style={styles.imageLink}
                            >
                                <div style={styles.imageContainer}>
                                    {item.image ? (
                                        <img
                                            src={`http://localhost:8000${item.image}`}
                                            alt={item.name}
                                            style={styles.productImage}
                                        />
                                    ) : (
                                        <div style={styles.placeholderImage}>
                                            <svg
                                                style={styles.placeholderIcon}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <h3 style={styles.brandName}>{item.brand}</h3>
                            <p style={styles.coffretDesc}>
                                Coffret Parfum <br />
                                {item.name}
                            </p>
                            <span style={styles.price}>{item.price}€</span>
                            <button
                                style={styles.addToCartButton}
                                onClick={() => handleAddToCart(item)}
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    FACEBOOK &nbsp; INSTAGRAM &nbsp; TWITTER &nbsp; PINTEREST
                </p>
            </footer>
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        padding: 0,
        margin: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        backgroundColor: "#111",
        padding: "20px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
    },
    logo: {
        fontSize: "30px",
        marginRight: "10px",
    },
    brand: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    cartLink: {
        color: "#fff",
        textDecoration: "underline",
        fontSize: "16px",
        marginRight: "20px",
    },
    selection: {
        padding: "40px 20px",
        backgroundColor: "#f9f9f9",
        height: "100%",
    },
    selectionTitle: {
        fontSize: "28px",
        textAlign: "center",
        marginBottom: "20px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
    },
    coffret: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    imageContainer: {
        width: "100%",
        height: "150px",
        marginBottom: "15px",
        borderRadius: "6px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    imageLink: {
        textDecoration: "none",
        display: "block",
        cursor: "pointer",
    },
    productImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    placeholderImage: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        backgroundColor: "#f0f0f0",
    },
    placeholderIcon: {
        width: "40px",
        height: "40px",
    },
    brandName: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    coffretDesc: {
        fontSize: "14px",
        color: "#555",
        margin: "10px 0",
    },
    price: {
        fontSize: "16px",
        color: "#000",
        fontWeight: "bold",
    },
    addToCartButton: {
        marginTop: "10px",
        padding: "8px 12px",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    footer: {
        backgroundColor: "#111",
        padding: "20px",
        color: "white",
        textAlign: "center",
        marginTop: "40px",
    },
    footerText: {
        fontSize: "14px",
    },
    alert: {
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "#4caf50",
        color: "white",
        padding: "12px 20px",
        borderRadius: "6px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        transition: "opacity 0.3s ease",
        fontWeight: "bold",
    },
};
