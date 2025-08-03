"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductImage from "@/components/ProductImage";
import SearchBar from "@/components/ui/SearchBar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Erreur sur le chargement des produits:", err)
      );

    // produits populaires
    fetch("http://localhost:8000/api/products/popular")
      .then((res) => res.json())
      .then((data) => setPopularProducts(data))
      .catch((err) =>
        console.error("Erreur sur le chargement des produits populaires:", err)
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

  const handleSearch = async (query) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/products/search?name=${query}`
      );

      if (!res.ok) {
        console.error("Erreur HTTP", res.status);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
        if (data.length === 0) {
          console.log("Aucun produit trouvé");
        }
      } else {
        console.error("Données inattendues :", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
    }
  };

  return (
    <div style={styles.page}>
      {showAlert && <div style={styles.alert}>Article ajouté au panier ✅</div>}
      <Header />
      <SearchBar onSearch={handleSearch} />

      {/* produits pops */}
      <section style={styles.popularSection}>
        <h2 style={styles.popularTitle}>PRODUITS POPULAIRES</h2>
        <div style={styles.popularGrid}>
          {popularProducts.map((item, index) => (
            <div key={index} style={styles.popularProduct}>
              <Link href={`/products/${item.id}`} style={styles.link}>
                <h3 style={styles.popularBrandName}>{item.brand}</h3>
                <div style={styles.popularImageWrapper}>
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    style={styles.popularImage}
                    width="100%"
                    height="100%"
                    placeholderClassName="rounded-xl border border-gray-200"
                  />
                </div>
                <p style={styles.popularDesc}>{item.name}</p>
                <span style={styles.popularPrice}>{item.price}€</span>
                <div style={styles.viewsCount}>
                  vu par {item.views} personnes
                </div>
              </Link>
              <button
                style={styles.popularAddButton}
                onClick={() => handleAddToCart(item)}
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.selection}>
        <h2 style={styles.popularTitle}>SHOP</h2>
        <div style={styles.popularGrid}>
          {products.map((item, index) => (
            <div key={index} style={styles.popularProduct}>
              <Link href={`/products/${item.id}`} style={styles.link}>
                <h3 style={styles.popularBrandName}>{item.brand}</h3>
                <div style={styles.popularImageWrapper}>
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    style={styles.popularImage}
                    width="100%"
                    height="100%"
                    placeholderClassName="rounded-xl border border-gray-200"
                  />
                </div>
                <p style={styles.popularDesc}>{item.name}</p>
                <span style={styles.popularPrice}>{item.price}€</span>
              </Link>
              <button
                style={styles.popularAddButton}
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
  popularSection: {
    padding: "40px 20px 20px 20px",
    backgroundColor: "#F8F6FF",
    borderBottom: "2px solid #E0D4FF",
  },
  popularTitle: {
    fontSize: "28px",
    textAlign: "center",
    marginBottom: "30px",
    color: "#4B0082",
    fontWeight: "700",
    textShadow: "0 2px 4px rgba(75, 0, 130, 0.1)",
  },
  popularGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  popularProduct: {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(75, 0, 130, 0.15)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "2px solid #E0D4FF",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(75, 0, 130, 0.25)",
    },
  },
  popularImageWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "8px",
    width: "100px",
    height: "100px",
    margin: "8px auto",
    overflow: "hidden",
    borderRadius: "10px",
    border: "2px solid #E0D4FF",
    aspectRatio: "1 / 1",
    position: "relative",
  },
  popularImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
  },
  popularBrandName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#4B0082",
    margin: "0 0 8px 0",
  },
  popularDesc: {
    fontSize: "12px",
    color: "#666",
    margin: "8px 0",
    lineHeight: "1.3",
  },
  popularPrice: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#F041A0",
    display: "block",
    margin: "8px 0",
  },
  popularAddButton: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#F041A0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "12px",
    width: "100%",
  },
  viewsCount: {
    fontSize: "10px",
    color: "#999",
    marginTop: "4px",
    fontStyle: "italic",
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
    width: "140px",
    height: "140px",
    margin: "10px auto",
    overflow: "hidden",
    borderRadius: "12px",
    border: "1px solid #ddd",
    aspectRatio: "1 / 1",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
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
