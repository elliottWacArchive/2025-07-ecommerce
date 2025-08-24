"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout, loading, setUser } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/update-credentials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`, 
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: passwordConfirm,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Erreur API :", data); 
        setError(data.message || JSON.stringify(data)); 
      } else {
        setSuccess("Mise à jour réussie ✅");
        setUser(data.user);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setError(err.message || "Erreur inconnue");
    }
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

        <section className="bg-[#CECDFF] rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-[#5A3A99] mb-2">
            Bienvenue, {user.name} !
          </h2>
          <p className="text-gray-800">Email : {user.email}</p>
          <p className="text-gray-800">
            Compte créé le : {new Date(user.created_at).toLocaleDateString()}
          </p>
        </section>

        <section className="bg-[#F0EBFF] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#C395E4] mb-3">
            Actions disponibles :
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Voir mon profil</li>
            <li>Gérer mes commandes</li>
            <li>
              <button
                onClick={() => setShowModal(true)}
                className="text-[#5A3A99] underline"
              >
                Modifier mes informations
              </button>
            </li>
          </ul>
        </section>

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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-[#5A3A99] mb-4">
              Modifier mes informations
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <input
              type="email"
              placeholder="Nouvel email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="Confirmer mot de passe"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                className="bg-[#C395E4] text-white px-4 py-2 rounded-lg hover:bg-[#b07cd8]"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
