"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import ProductImage from "@/components/ProductImage";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [subSubcategories, setSubSubcategories] = useState([]);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [categoryObj, setCategoryObj] = useState(null);

  useEffect(() => {
    if (!category) return;

    const fetchCategoryObject = async () => {
      const res = await fetch(
        `http://localhost:8000/api/categories/by-name?name=${category}`
      );
      const data = await res.json();
      setCategoryObj(data);
    };

    fetchCategoryObject();
  }, [category]);

  // Charger sous-catégories dès qu’on arrive sur la page
  useEffect(() => {
    if (!categoryObj) return;

    const fetchSubcategories = async () => {
      const res = await fetch(
        `http://localhost:8000/api/subcategories/by-category?category_id=${categoryObj.id}`
      );
      const data = await res.json();
      setSubcategories(data);
    };

    fetchSubcategories();
  }, [categoryObj]);

  // Charger les produits de la catégorie générale quand aucune sous-catégorie sélectionnée
  useEffect(() => {
    if (!category || selectedSubcategory || selectedSubSubcategory) return;

    const fetchCategoryProducts = async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/products/by-category?category=${category}`
      );
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [category, selectedSubcategory, selectedSubSubcategory]);

  // Quand on clique sur une sous-catégorie
  useEffect(() => {
    if (!selectedSubcategory) return;

    const fetchSubSubcategories = async () => {
      const res = await fetch(
        `http://localhost:8000/api/subsubcategories/by-subcategory?subcategory_id=${selectedSubcategory.id}`
      );
      const data = await res.json();
      setSubSubcategories(data);
    };

    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/products/by-subcategory?subcategory_id=${selectedSubcategory.id}`
      );
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchSubSubcategories();
    fetchProducts();
  }, [selectedSubcategory]);

  // quand on clique sur une sous-sous-catégorie
  useEffect(() => {
    if (!selectedSubSubcategory) return;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/products/by-subsubcategory?sub_subcategory_id=${selectedSubSubcategory}`
      );
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchFilteredProducts();
  }, [selectedSubSubcategory]);

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
      <Header />
      {showAlert && <div style={styles.alert}>Article ajouté au panier ✅</div>}
      <section style={styles.selection}>
        <h1 style={styles.selectionTitle}>Catégorie : {category}</h1>

        {/* sous-catégories */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {subcategories.map((scat) => (
            <button
              key={scat.id}
              onClick={() => {
                setSelectedSubcategory(scat);
                setSelectedSubSubcategory(null);
              }}
              style={{
                padding: "10px 16px",
                backgroundColor:
                  scat.id === selectedSubcategory?.id ? "#4B0082" : "#fff",
                color: scat.id === selectedSubcategory?.id ? "#fff" : "#000",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {scat.name}
            </button>
          ))}
        </div>

        {/* sous-sous-catégories */}
        {subSubcategories.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {subSubcategories.map((sscat) => (
              <button
                key={sscat.id}
                onClick={() => setSelectedSubSubcategory(sscat.id)}
                style={{
                  padding: "8px 14px",
                  backgroundColor:
                    sscat.id === selectedSubSubcategory ? "#F041A0" : "#fff",
                  color: sscat.id === selectedSubSubcategory ? "#fff" : "#000",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {sscat.name}
              </button>
            ))}
          </div>
        )}

        {/* produits */}
        {loading ? (
          <p style={styles.loading}>Chargement...</p>
        ) : !products.length ? (
          <p style={styles.empty}>Aucun produit trouvé</p>
        ) : (
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
                  <p style={styles.coffretDesc}>{item.name}</p>
                  <span style={styles.price}>{item.price}€</span>
                </Link>
                <br />
                <button
                  style={styles.addToCartButton}
                  onClick={() => handleAddToCart(item)}
                >
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        )}
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
