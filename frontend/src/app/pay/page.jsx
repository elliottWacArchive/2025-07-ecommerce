"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StripePaymentForm from "@/components/StripePaymentForm";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Pay() {
    const [guestMode, setGuestMode] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        name: "",
        email: "",
        address: "",
    });
    const [paymentStep, setPaymentStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [shippingInfo, setShippingInfo] = useState({
        country: "France",
        delivery_method: "",
    });
    const [shippingCost, setShippingCost] = useState(0);
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [shippingStep, setShippingStep] = useState(false);

    const { user, loading: authLoading } = useAuth();
    const { cart, getCartTotal, clearCart } = useCart();
    const router = useRouter();

    const cartTotal = getCartTotal();
    const totalWithShipping = cartTotal + shippingCost;

    useEffect(() => {
        if (!authLoading && user) {
            setShippingStep(true);
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (shippingInfo.country && cartTotal > 0) {
            loadDeliveryOptions();
        }
    }, [shippingInfo.country, cartTotal]);

    const loadDeliveryOptions = async () => {
        const defaultOptions = [
            {
                method: "Standard",
                cost: 5.99,
                delivery_time: "3-5 jours ouvrés",
            },
            {
                method: "Express",
                cost: 9.99,
                delivery_time: "1-2 jours ouvrés",
            },
            {
                method: "Gratuite",
                cost: 0,
                delivery_time: "7-10 jours ouvrés",
            },
        ];
        setDeliveryOptions(defaultOptions);
    };

    const calculateShippingCost = async (country, deliveryMethod) => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/shipping/calculate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        country,
                        delivery_method: deliveryMethod,
                        order_amount: cartTotal,
                    }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                return data.shipping_cost;
            }
        } catch (error) {
            console.error(
                "Erreur lors du calcul des frais de livraison:",
                error
            );
        }
        return 0;
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        const newShippingInfo = { ...shippingInfo, [name]: value };
        setShippingInfo(newShippingInfo);

        if (name === "delivery_method" && value) {
            const selectedOption = deliveryOptions.find(
                (opt) => opt.method === value
            );
            if (selectedOption) {
                setShippingCost(selectedOption.cost);
            }
        }
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        if (shippingInfo.delivery_method) {
            setPaymentStep(true);
        }
    };

    const handleGuestInfoSubmit = (e) => {
        e.preventDefault();
        if (guestInfo.name && guestInfo.email && guestInfo.address) {
            setShippingStep(true);
        }
    };

    const handleGuestInfoChange = (e) => {
        setGuestInfo({
            ...guestInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        setLoading(true);
        try {
            const shippingAddress =
                paymentIntent.shipping?.address ||
                paymentIntent.charges?.data?.[0]?.billing_details?.address;

            const orderData = {
                payment_intent_id: paymentIntent.id,
                amount: totalWithShipping,
                shipping_cost: shippingCost,
                shipping_method: shippingInfo.delivery_method,
                delivery_time:
                    deliveryOptions.find(
                        (opt) => opt.method === shippingInfo.delivery_method
                    )?.delivery_time || null,
                items: cart,
                customer_info: user
                    ? {
                          name: user.name,
                          email: user.email,
                          user_id: user.id,
                      }
                    : guestInfo,
                shipping_address: shippingAddress,
            };

            const response = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(user && {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    }),
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                clearCart();
                setSuccess(
                    "Paiement réussi ! Votre commande a été enregistrée."
                );
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                throw new Error(
                    "Erreur lors de l'enregistrement de la commande"
                );
            }
        } catch (error) {
            setError(
                "Paiement réussi mais erreur lors de l'enregistrement de la commande"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentError = (error) => {
        setError(error.message || "Erreur lors du paiement");
    };

    if (authLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-[#CECDFF] py-8 flex items-center justify-center">
                    <div className="text-gray-600">Chargement...</div>
                </div>
            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-[#CECDFF] py-8">
                    <div className="max-w-2xl mx-auto px-4">
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <h1 className="text-3xl font-bold text-[#C395E4] mb-6">
                                Panier vide
                            </h1>
                            <p className="text-gray-700 mb-6">
                                Votre panier est vide. Ajoutez des produits
                                avant de procéder au paiement.
                            </p>
                            <Link
                                href="/"
                                className="bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                            >
                                Continuer les achats
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#CECDFF] py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-[#C395E4] mb-6">
                            Paiement
                        </h1>

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Récapitulatif de commande
                            </h3>
                            <div className="space-y-2">
                                {cart.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span>
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                            €
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Sous-total:</span>
                                        <span>{cartTotal.toFixed(2)}€</span>
                                    </div>
                                    {shippingCost > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                Frais de livraison (
                                                {shippingInfo.delivery_method}):
                                            </span>
                                            <span>
                                                {shippingCost.toFixed(2)}€
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                                        <span>Total:</span>
                                        <span>
                                            {totalWithShipping.toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                {error}
                            </div>
                        )}

                        {!shippingStep && !paymentStep ? (
                            user ? (
                                <div className="text-center">
                                    <p className="text-gray-700 mb-4">
                                        Connecté en tant que{" "}
                                        <strong>{user.name}</strong>
                                    </p>
                                    <button
                                        onClick={() => setShippingStep(true)}
                                        className="bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Choisir la livraison
                                    </button>
                                </div>
                            ) : !guestMode ? (
                                <div className="space-y-6 text-center">
                                    <p className="text-gray-700">
                                        Vous pouvez vous connecter, créer un
                                        compte ou continuer en tant qu'invité.
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
                                            Continuer en tant qu'invité
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                        Commande en tant qu'invité
                                    </h2>
                                    <form
                                        onSubmit={handleGuestInfoSubmit}
                                        className="space-y-4"
                                    >
                                        <input
                                            type="text"
                                            name="name"
                                            value={guestInfo.name}
                                            onChange={handleGuestInfoChange}
                                            placeholder="Nom complet"
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={guestInfo.email}
                                            onChange={handleGuestInfoChange}
                                            placeholder="Adresse email"
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                
                                        <button
                                            type="submit"
                                            className="w-full bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            Finaliser la commande
                                        </button>
                                    </form>
                                    <button
                                        onClick={() => setGuestMode(false)}
                                        className="mt-4 text-gray-600 hover:text-gray-800 underline"
                                    >
                                        Retour aux options de connexion
                                    </button>
                                </div>
                            )
                        ) : shippingStep && !paymentStep ? (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Options de livraison
                                </h2>
                                <form
                                    onSubmit={handleShippingSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pays de livraison
                                        </label>
                                        <select
                                            name="country"
                                            value={shippingInfo.country}
                                            onChange={handleShippingChange}
                                            className="w-full border rounded-lg px-4 py-2"
                                        >
                                            <option value="France">
                                                France
                                            </option>
                                            <option value="Belgium">
                                                Belgique
                                            </option>
                                            <option value="Spain">
                                                Espagne
                                            </option>
                                            <option value="Italy">
                                                Italie
                                            </option>
                                        </select>
                                    </div>

                                    {deliveryOptions.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mode de livraison
                                            </label>
                                            <div className="space-y-2">
                                                {deliveryOptions.map(
                                                    (option, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="delivery_method"
                                                                value={
                                                                    option.method
                                                                }
                                                                onChange={
                                                                    handleShippingChange
                                                                }
                                                                className="mr-3"
                                                                required
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-medium">
                                                                        {
                                                                            option.method
                                                                        }
                                                                    </span>
                                                                    <span className="font-semibold text-[#C395E4]">
                                                                        {option.cost.toFixed(
                                                                            2
                                                                        )}
                                                                        €
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        option.delivery_time
                                                                    }
                                                                </p>
                                                            </div>
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShippingStep(false);
                                                if (!user) setGuestMode(false);
                                            }}
                                            className="text-gray-600 hover:text-gray-800 underline"
                                        >
                                            Retour
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#FC87D2] hover:bg-[#f56dc0] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                            disabled={
                                                !shippingInfo.delivery_method
                                            }
                                        >
                                            Procéder au paiement
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Informations de paiement
                                </h2>
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        {user ? (
                                            <>
                                                Commande pour:{" "}
                                                <strong>{user.name}</strong> (
                                                {user.email})
                                            </>
                                        ) : (
                                            <>
                                                Commande pour:{" "}
                                                <strong>
                                                    {guestInfo.name}
                                                </strong>{" "}
                                                ({guestInfo.email})
                                            </>
                                        )}
                                    </p>
                                </div>
                                <StripePaymentForm
                                    amount={totalWithShipping}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    disabled={loading}
                                    user={user}
                                />
                                <button
                                    onClick={() => {
                                        setPaymentStep(false);
                                        setShippingStep(true);
                                    }}
                                    className="mt-4 text-gray-600 hover:text-gray-800 underline"
                                    disabled={loading}
                                >
                                    Retour
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
