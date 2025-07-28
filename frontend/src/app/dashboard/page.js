"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <div>Redirection...</div>;
  }

  return (
    <div>
      <h1>Tableau de bord</h1>
      <div>
        <h2>Bienvenue, {user.name} !</h2>
        <p>Email : {user.email}</p>
        <p>Compte créé le : {new Date(user.created_at).toLocaleDateString()}</p>
      </div>

      <div>
        <h3>Actions disponibles :</h3>
        <ul>
          <li>Voir mon profil</li>
          <li>Gérer mes commandes</li>
          <li>Modifier mes informations</li>
        </ul>
      </div>
      <button onClick={() => router.push("/admin")}>Admin</button>

      {user?.role === "admin" && (
        <button onClick={() => router.push("/admin")}>
          Accéder à l'interface admin
        </button>
      )}
    </div>
  );
}
