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

    if (authLoading || loading) {
        return (
            <p className="text-center text-[#C395E4] font-medium mt-12">
                Chargement de l'interface admin...
            </p>
        );
    }

    if (!user || !isAdmin) {
        return (
            <p className="text-center text-red-500 font-semibold mt-12">
                Accès non autorisé
            </p>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDF6FF] py-12 px-4 flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-[#C395E4] text-center mb-6">
                    Espace Administrateur
                </h1>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/admin/products")}
                        className="bg-[#C395E4] hover:bg-[#b27bd7] text-white font-semibold py-2 px-6 rounded-full transition"
                    >
                        Produits
                    </button>
                    <button
                        onClick={() => router.push("/admin/categories")}
                        className="bg-[#9e90ed] hover:bg-[#8678d1] text-white font-semibold py-2 px-6 rounded-full transition"
                    >
                        Catégories
                    </button>
                    <button
                        onClick={() => router.push("/admin/users")}
                        className="bg-[#FC87D2] hover:bg-[#f56bc9] text-white font-semibold py-2 px-6 rounded-full transition"
                    >
                        Utilisateurs
                    </button>
                </div>

                <h2 className="text-xl font-semibold text-[#A46BCE] mb-4">
                    Catégories
                </h2>
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className="bg-[#FDE7FA] text-[#AA3F9D] px-4 py-2 rounded-lg shadow-sm"
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
