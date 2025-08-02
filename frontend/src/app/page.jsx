"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#F7F4FF] px-4">
            <div className="bg-white shadow-lg border border-[#CECDFF] rounded-2xl p-10 max-w-xl w-full text-center space-y-6">
                <h1 className="text-4xl font-bold text-[#C395E4]">
                    Bienvenue !
                </h1>
                <p className="text-gray-700">
                    Ceci est la page d'accueil de notre boutique.
                </p>
                <button
                    className="bg-[#FC87D2] hover:bg-[#f56dc0] transition text-white font-semibold py-2 px-6 rounded-full"
                    onClick={() => router.push("/actualites")}
                >
                    Explorer les produits
                </button>
            </div>
        </main>
    );
}
