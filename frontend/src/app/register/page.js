"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
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

        const result = await register(
            formData.name,
            formData.email,
            formData.password
        );

        if (result.success) {
            setMessage("Inscription réussie ! Redirection...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } else {
            setMessage(result.message || "Erreur lors de l'inscription");
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Inscription</h1>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom :</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                        minLength="8"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </button>
            </form>
        </div>
    );
}
