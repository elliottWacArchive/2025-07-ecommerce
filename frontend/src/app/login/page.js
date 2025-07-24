"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const result = await login(formData.email, formData.password);

        if (result.success) {
            setMessage("Connexion réussie ! Redirection...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } else {
            setMessage(result.message || "Erreur lors de la connexion");
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Connexion</h1>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
            </form>

            <p>
                Pas encore de compte ? <a href="/register">S'inscrire</a>
            </p>
        </div>
    );
}
