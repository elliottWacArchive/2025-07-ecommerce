"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import "./style.css";

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
        <div className="form-container">
            <div className="login-container">
                <h1 className="title">Connexion</h1>

                {message && <p>{message}</p>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group email">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="exemple@email.com"
                        />
                    </div>

                    <div className="form-group password">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="mot de passe"
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
            <div className="info-container">
                <img src="/logo-crop.png" alt="Description de l'image" />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>
    );
}
