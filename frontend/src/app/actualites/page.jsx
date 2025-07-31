"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

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
      {showAlert && <div style={styles.alert}>Article ajouté au panier ✅</div>}
      <Header />

      <section style={styles.selection}>
        <h2 style={styles.selectionTitle}>SÉLECTION COFFRET</h2>
        <div style={styles.grid}>
          {products.map((item, index) => (
            <div key={index} style={styles.coffret}>
              <Link href={`/products/${item.id}`} style={styles.link}>
                <h3 style={styles.brandName}>{item.brand}</h3>
                <div style={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.image}
                  />
                </div>
                <p style={styles.coffretDesc}>
                  Coffret Parfum <br />
                  {item.name}
                </p>
                <span style={styles.price}>{item.price}€</span>
              </Link>
              <br></br>
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
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#D7C9F2",
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  selection: {
    padding: "40px 20px",
    flex: 1,
  },
  selectionTitle: {
    fontSize: "26px",
    textAlign: "center",
    marginBottom: "30px",
    color: "#4B0082",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
  },
  coffret: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
    transition: "transform 0.2s ease",
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  image: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#222",
  },
  coffretDesc: {
    fontSize: "14px",
    color: "#666",
    margin: "12px 0",
  },
  price: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#F041A0",
  },
  addToCartButton: {
    marginTop: "12px",
    padding: "10px 16px",
    backgroundColor: "#F041A0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  footer: {
    backgroundColor: "#4B0082",
    padding: "24px",
    color: "white",
    textAlign: "center",
    fontSize: "14px",
    marginTop: "40px",
  },
  footerText: {
    letterSpacing: "1px",
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
  link: {
    textDecoration: "none",
  },
};
