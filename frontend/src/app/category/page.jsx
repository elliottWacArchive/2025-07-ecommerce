"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import ProductImage from "@/components/ProductImage";

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

  if (loading) return <p style={styles.loading}>Chargement...</p>;

  if (!products.length)
    return <p style={styles.empty}>Aucun produit trouvé pour la catégorie "{category}"</p>;

  return (
    <div style={styles.page}>
      <Header />
      <section style={styles.selection}>
        <h1 style={styles.selectionTitle}>Catégorie : {category}</h1>
        <div style={styles.grid}>
          {products.map((item) => (
            <div key={item.id} style={styles.coffret}>
              <Link href={`/products/${item.id}`} style={styles.link}>
                <h3 style={styles.brandName}>{item.brand}</h3>
                <div style={styles.imageWrapper}>
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    style={styles.image}
                    width="100%"
                    height="100%"
                    placeholderClassName="rounded-xl border border-gray-200"
                  />
                </div>
                <p style={styles.coffretDesc}>
                  {item.name}
                </p>
                <span style={styles.price}>{item.price}€</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#D7C9F2",
    padding: "0",
    minHeight: "100vh",
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
  link: {
    textDecoration: "none",
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    fontSize: "18px",
  },
  empty: {
    padding: "40px",
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
};
