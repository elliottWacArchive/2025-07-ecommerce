"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "admin") {
      router.push("/dashboard"); // ou "/login" si tu préfères
      return;
    }

    // Authentifié ET admin
    setAuthorized(true);

    // Charger les catégories (exemple API admin)
    fetch("http://localhost:8000/admin/categories", {
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
      .catch(() => {
        setLoading(false);
        router.push("/dashboard");
      });
  }, [router]);

  if (!authorized || loading) return <p>Chargement de l'interface admin...</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Interface Admin</h1>
      <h2>Catégories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </main>
  );
}
