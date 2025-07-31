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
    return (
      <div className="text-center mt-12 text-[#C395E4] font-semibold">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-12 text-[#C395E4]">Redirection...</div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4FF] py-12 px-4 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl w-full space-y-8 border border-[#CECDFF]">
        <h1 className="text-4xl font-bold text-[#C395E4] text-center">
          Tableau de bord
        </h1>

        {/* Infos utilisateur */}
        <section className="bg-[#CECDFF] rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-[#5A3A99] mb-2">
            Bienvenue, {user.name} !
          </h2>
          <p className="text-gray-800">Email : {user.email}</p>
          <p className="text-gray-800">
            Compte créé le : {new Date(user.created_at).toLocaleDateString()}
          </p>
        </section>

        {/* Actions */}
        <section className="bg-[#F0EBFF] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#C395E4] mb-3">
            Actions disponibles :
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Voir mon profil</li>
            <li>Gérer mes commandes</li>
            <li>Modifier mes informations</li>
          </ul>
        </section>

        {/* Boutons */}
        <div className="space-y-4">
          {user?.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-[#FC87D2] hover:bg-[#f568c4] text-white font-bold py-2 px-6 rounded-full w-full transition"
            >
              Interface Admin
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-[#C395E4] hover:bg-[#b07cd8] text-white font-bold py-2 px-6 rounded-full w-full transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}
