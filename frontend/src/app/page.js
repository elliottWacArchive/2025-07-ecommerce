"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
    const { user, logout, loading } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
                <div className="row-start-2">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <h1 className="text-2xl font-bold">E-commerce Site</h1>

                {user ? (
                    <div className="flex flex-col gap-4 items-center">
                        <p>Bienvenue, {user.name} !</p>
                        <div className="flex gap-4 items-center flex-col sm:flex-row">
                            <Link
                                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                                href="/dashboard"
                            >
                                Tableau de bord
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <Link
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                            href="/register"
                        >
                            S'inscrire
                        </Link>
                        <Link
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
                            href="/login"
                        >
                            Se connecter
                        </Link>
                    </div>
                )}

                <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
                    <li className="mb-2 tracking-[-.01em]">
                        Get started by editing{" "}
                        <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
                            src/app/page.js
                        </code>
                        .
                    </li>
                    <li className="tracking-[-.01em]">
                        Save and see your changes instantly.
                    </li>
                </ol>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <a
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className="dark:invert"
                            src="/vercel.svg"
                            alt="Vercel logomark"
                            width={20}
                            height={20}
                        />
                        Deploy now
                    </a>
                    <a
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read our docs
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
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
            {showAlert && (
                <div style={styles.alert}>Article ajouté au panier ✅</div>
            )}
            <header style={styles.header}>
                <div style={styles.logoContainer}>
                    <span style={styles.logo}>[E]</span>
                    <span style={styles.brand}>PARFUMS</span>
                </div>
                <Link href="/cart" style={styles.cartLink}>
                    Voir le panier
                </Link>
            </header>

            <section style={styles.selection}>
                <h2 style={styles.selectionTitle}>SÉLECTION COFFRET</h2>
                <div style={styles.grid}>
                    {products.map((item, index) => (
                        <div key={index} style={styles.coffret}>
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
