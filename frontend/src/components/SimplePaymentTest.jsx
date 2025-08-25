"use client";

import { useState } from "react";

export default function SimplePaymentTest({ amount, onSuccess, onError }) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleTestPayment = async () => {
        setProcessing(true);
        setError("");

        try {
            console.log("Testing payment with amount:", amount);

            const response = await fetch(
                "http://localhost:8000/api/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: Math.round(amount * 100),
                        currency: "eur",
                    }),
                }
            );

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("Payment intent created:", data);

            if (data.client_secret) {
                if (onSuccess) {
                    onSuccess({
                        id: data.payment_intent_id,
                        status: "succeeded",
                    });
                }
            } else {
                throw new Error("Client secret manquant");
            }
        } catch (err) {
            console.error("Payment test error:", err);
            setError(err.message);
            if (onError) onError(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Test de Paiement</h3>
            <p>Montant: {amount.toFixed(2)}€</p>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    Erreur: {error}
                </div>
            )}

            <button
                onClick={handleTestPayment}
                disabled={processing}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                    processing
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
                {processing ? "Test en cours..." : "Tester l'API de Paiement"}
            </button>
        </div>
    );
}
