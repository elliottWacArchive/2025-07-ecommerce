"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51XXXXXXXXX"
);

export function useStripe() {
    const [stripe, setStripe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                const stripeInstance = await stripePromise;
                setStripe(stripeInstance);
            } catch (error) {
                console.error(
                    "Erreur lors de l'initialisation de Stripe:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        initializeStripe();
    }, []);

    const createPaymentIntent = async (amount, currency = "eur") => {
        try {
            const token = localStorage.getItem("auth_token");
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(
                "http://localhost:8000/api/create-payment-intent",
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        amount: Math.round(amount * 100),
                        currency,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(
                "Erreur lors de la création du PaymentIntent:",
                error
            );
            throw error;
        }
    };

    const confirmPayment = async (clientSecret, paymentMethod) => {
        if (!stripe) {
            throw new Error("Stripe n'est pas initialisé");
        }

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod,
            });

            return result;
        } catch (error) {
            console.error("Erreur lors de la confirmation du paiement:", error);
            throw error;
        }
    };

    return {
        stripe,
        loading,
        createPaymentIntent,
        confirmPayment,
    };
}
