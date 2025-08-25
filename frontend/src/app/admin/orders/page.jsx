"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.push("/login");
            return;
        }

        if (user && user.role === "admin") {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/admin/orders",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }

            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-green-100 text-green-800",
            shipped: "bg-blue-100 text-blue-800",
            canceled: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {status}
            </span>
        );
    };

    if (authLoading || loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-100 py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center">Chargement...</div>
                    </div>
                </div>
            </>
        );
    }

    if (!user || user.role !== "admin") {
        return null;
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestion des commandes
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Visualisez et gérez toutes les commandes
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            Erreur: {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                Commandes ({orders.length})
                            </h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                Aucune commande trouvée
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {order.customer_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.customer_email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parseFloat(
                                                        order.total_price
                                                    ).toFixed(2)}
                                                    €
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedOrder(
                                                                order
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Détails
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Détails de la commande #{selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Informations client
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Nom: {selectedOrder.customer_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Email:{" "}
                                            {selectedOrder.customer_email}
                                        </p>
                                        {selectedOrder.customer_address && (
                                            <p className="text-sm text-gray-600">
                                                Adresse:{" "}
                                                {selectedOrder.customer_address}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Informations commande
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Sous-total:{" "}
                                            {(
                                                parseFloat(
                                                    selectedOrder.total_price
                                                ) -
                                                parseFloat(
                                                    selectedOrder.shipping_cost ||
                                                        0
                                                )
                                            ).toFixed(2)}
                                            €
                                        </p>
                                        {selectedOrder.shipping_cost > 0 && (
                                            <p className="text-sm text-gray-600">
                                                Frais de livraison:{" "}
                                                {parseFloat(
                                                    selectedOrder.shipping_cost
                                                ).toFixed(2)}
                                                €
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600">
                                            Total:{" "}
                                            {parseFloat(
                                                selectedOrder.total_price
                                            ).toFixed(2)}
                                            €
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Statut:{" "}
                                            {getStatusBadge(
                                                selectedOrder.status
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Date:{" "}
                                            {formatDate(
                                                selectedOrder.created_at
                                            )}
                                        </p>
                                        {selectedOrder.payment_intent_id && (
                                            <p className="text-sm text-gray-600">
                                                Payment ID:{" "}
                                                {
                                                    selectedOrder.payment_intent_id
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {(selectedOrder.shipping_method ||
                                    selectedOrder.delivery_time) && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            Informations de livraison
                                        </h4>
                                        {selectedOrder.shipping_method && (
                                            <p className="text-sm text-gray-600">
                                                Mode de livraison:{" "}
                                                {selectedOrder.shipping_method}
                                            </p>
                                        )}
                                        {selectedOrder.delivery_time && (
                                            <p className="text-sm text-gray-600">
                                                Délai de livraison:{" "}
                                                {selectedOrder.delivery_time}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {selectedOrder.items && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            Articles commandés
                                        </h4>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Produit
                                                        </th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Quantité
                                                        </th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Prix
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {selectedOrder.items.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                                    {item.name}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                                    {(
                                                                        item.price *
                                                                        item.quantity
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    €
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
