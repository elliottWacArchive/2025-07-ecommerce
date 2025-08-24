"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";

export default function Pay() {
    const [guestMode, setGuestMode] = useState(false);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#CECDFF] py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-[#C395E4] mb-6">
                            Paiement
                        </h1>

                        {!guestMode ? (
                            <div className="space-y-6 text-center">
                                <p className="text-gray-700">
                                    Vous pouvez vous connecter, créer un compte ou continuer en tant qu’invité.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <Link
                                        href="/login"
                                        className="bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Se connecter
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="bg-[#C395E4] hover:bg-[#a774c8] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Créer un compte
                                    </Link>

                                    <button
                                        onClick={() => setGuestMode(true)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Continuer en tant qu’invité
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Commande en tant qu’invité
                                </h2>
                                <form className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Nom complet"
                                        className="w-full border rounded-lg px-4 py-2"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Adresse email"
                                        className="w-full border rounded-lg px-4 py-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Adresse de livraison"
                                        className="w-full border rounded-lg px-4 py-2"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Payer maintenant
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
