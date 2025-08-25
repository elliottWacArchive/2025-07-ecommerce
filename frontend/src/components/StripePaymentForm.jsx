"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const cardElementOptions = {
    style: {
        base: {
            fontSize: "16px",
            color: "#424770",
            "::placeholder": {
                color: "#aab7c4",
            },
            padding: "12px",
        },
        invalid: {
            color: "#9e2146",
        },
    },
    hidePostalCode: true,
};

function CheckoutForm({
    amount,
    onSuccess,
    onError,
    disabled = false,
    user = null,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [cardholderName, setCardholderName] = useState(user?.name || "");
    const [showTestCards, setShowTestCards] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        line1: "",
        line2: "",
        city: "",
        postal_code: "",
        country: "FR",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || disabled || processing) {
            return;
        }

        if (!cardholderName.trim()) {
            setError("Veuillez entrer le nom du titulaire de la carte");
            return;
        }

        if (
            !shippingAddress.line1.trim() ||
            !shippingAddress.city.trim() ||
            !shippingAddress.postal_code.trim()
        ) {
            setError("Veuillez remplir tous les champs d'adresse obligatoires");
            return;
        }

        setProcessing(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8000/api/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(localStorage.getItem("auth_token") && {
                            Authorization: `Bearer ${localStorage.getItem(
                                "auth_token"
                            )}`,
                        }),
                    },
                    body: JSON.stringify({
                        amount: Math.round(amount * 100),
                        currency: "eur",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erreur ${response.status}: ${response.statusText}`
                );
            }

            const { client_secret } = await response.json();

            if (!client_secret) {
                throw new Error("Client secret manquant");
            }

            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: cardholderName,
                            address: {
                                line1: shippingAddress.line1,
                                line2: shippingAddress.line2,
                                city: shippingAddress.city,
                                postal_code: shippingAddress.postal_code,
                                country: shippingAddress.country,
                            },
                        },
                    },
                    shipping: {
                        name: cardholderName,
                        address: {
                            line1: shippingAddress.line1,
                            line2: shippingAddress.line2,
                            city: shippingAddress.city,
                            postal_code: shippingAddress.postal_code,
                            country: shippingAddress.country,
                        },
                    },
                });

            if (stripeError) {
                let errorMessage = stripeError.message;

                if (stripeError.code === "card_declined") {
                    errorMessage =
                        "🧪 Carte refusée. En mode test, utilisez 4242 4242 4242 4242 pour un paiement réussi.";
                } else if (stripeError.code === "incorrect_number") {
                    errorMessage =
                        "🧪 Numéro de carte incorrect. Utilisez 4242 4242 4242 4242 pour tester.";
                } else if (
                    stripeError.code === "invalid_expiry_month" ||
                    stripeError.code === "invalid_expiry_year"
                ) {
                    errorMessage =
                        "🧪 Date d'expiration invalide. Utilisez une date future comme 12/25.";
                } else if (stripeError.code === "invalid_cvc") {
                    errorMessage =
                        "🧪 CVC invalide. Utilisez n'importe quels 3 chiffres comme 123.";
                }

                setError(errorMessage);
                if (onError) onError(stripeError);
            } else if (paymentIntent.status === "succeeded") {
                if (onSuccess) onSuccess(paymentIntent);
            }
        } catch (err) {
            console.error("Erreur de paiement:", err);
            setError(err.message || "Une erreur est survenue lors du paiement");
            if (onError) onError(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="cardholder-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Nom du titulaire de la carte
                </label>
                <input
                    id="cardholder-name"
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                    disabled={disabled || processing}
                    required
                />
            </div>

            <div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Informations de la carte
                    </label>

                    <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <p className="font-medium text-blue-800 mb-1">
                            🧪 Mode test - Utilisez ces cartes de test :
                        </p>
                        <ul className="text-blue-700 space-y-1">
                            <li>
                                <strong>4242 4242 4242 4242</strong> - Visa
                                (succès)
                            </li>
                            <li>
                                <strong>4000 0000 0000 0002</strong> - Carte
                                refusée
                            </li>
                            <li>
                                <strong>4000 0000 0000 9995</strong> - Fonds
                                insuffisants
                            </li>
                        </ul>
                        <p className="mt-1 text-xs text-blue-600">
                            Date d'expiration : toute date future (ex: 12/25) |
                            CVC : n'importe quels 3 chiffres
                        </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-white focus-within:ring-2 focus-within:ring-[#C395E4] focus-within:border-transparent">
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                    Adresse de livraison
                </h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse *
                    </label>
                    <input
                        type="text"
                        value={shippingAddress.line1}
                        onChange={(e) =>
                            setShippingAddress({
                                ...shippingAddress,
                                line1: e.target.value,
                            })
                        }
                        placeholder="123 Rue de la Paix"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                        disabled={disabled || processing}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complément d'adresse
                    </label>
                    <input
                        type="text"
                        value={shippingAddress.line2}
                        onChange={(e) =>
                            setShippingAddress({
                                ...shippingAddress,
                                line2: e.target.value,
                            })
                        }
                        placeholder="Appartement, étage, bâtiment..."
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                        disabled={disabled || processing}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ville *
                        </label>
                        <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    city: e.target.value,
                                })
                            }
                            placeholder="Paris"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                            disabled={disabled || processing}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Code postal *
                        </label>
                        <input
                            type="text"
                            value={shippingAddress.postal_code}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    postal_code: e.target.value,
                                })
                            }
                            placeholder="75001"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                            disabled={disabled || processing}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pays
                    </label>
                    <select
                        value={shippingAddress.country}
                        onChange={(e) =>
                            setShippingAddress({
                                ...shippingAddress,
                                country: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C395E4] focus:border-transparent"
                        disabled={disabled || processing}
                    >
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="DE">Allemagne</option>
                        <option value="ES">Espagne</option>
                        <option value="IT">Italie</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={
                    !stripe || disabled || processing || !cardholderName.trim()
                }
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                    !stripe || disabled || processing || !cardholderName.trim()
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#FC87D2] hover:bg-[#f56dc0] text-white"
                }`}
            >
                {processing
                    ? "Traitement en cours..."
                    : `Payer ${amount.toFixed(2)}€`}
            </button>

            <div className="text-xs text-gray-500 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Paiement sécurisé par Stripe</span>
                </div>
            </div>
        </form>
    );
}

export default function StripePaymentForm({
    amount,
    onSuccess,
    onError,
    disabled = false,
    user = null,
}) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                amount={amount}
                onSuccess={onSuccess}
                onError={onError}
                disabled={disabled}
                user={user}
            />
        </Elements>
    );
}
