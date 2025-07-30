"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;

        if (!user || !token || !isAdmin) {
            router.push("/dashboard");
            return;
        }

        fetch("http://localhost:8000/api/admin/categories", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Accès refusé");
                const data = await res.json();
                setCategories(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors du chargement des catégories:",
                    error
                );
                setLoading(false);
                router.push("/dashboard");
            });
    }, [user, token, isAdmin, authLoading, router]);

    if (authLoading || loading)
        return <p>Chargement de l'interface admin...</p>;

    if (!user || !isAdmin) {
        return <p>Accès non autorisé</p>;
    }

    return (
        <main style={{ padding: "2rem" }}>
            <button onClick={() => router.push("/admin/products")}>
                Gérer les produits
            </button>
            <button onClick={() => router.push("/admin/users")}>
                Gérer les utilisateurs
            </button>

            <h2>Catégories</h2>
            <ul>
                {categories.map((cat) => (
                    <li key={cat.id}>{cat.name}</li>
                ))}
            </ul>
        </main>
    );
}
