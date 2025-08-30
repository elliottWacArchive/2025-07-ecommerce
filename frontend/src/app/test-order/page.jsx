"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestOrderPage() {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);

    const createTestOrder = async () => {
        if (!user || !token) {
            toast.error("Vous devez être connecté");
            return;
        }

        setLoading(true);
        try {
            const testOrder = {
                payment_intent_id: `test_${Date.now()}`,
                amount: 49.99,
                items: [
                    {
                        name: "Produit de test",
                        price: 29.99,
                        quantity: 1,
                        brand: "Test Brand",
                    },
                    {
                        name: "Deuxième produit",
                        price: 19.99,
                        quantity: 1,
                        brand: "Another Brand",
                    },
                ],
                customer_info: {
                    name: user.name,
                    email: user.email,
                    address: "123 Rue de Test, 75001 Paris, France",
                },
                shipping_cost: 5.99,
                shipping_method: "Standard",
                delivery_time: "2-3 jours ouvrés",
            };

            const response = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(testOrder),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Erreur ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            console.log("Test order created:", data);
            toast.success("Commande de test créée avec succès !");
        } catch (error) {
            console.error(
                "Erreur lors de la création de la commande de test:",
                error
            );
            toast.error("Erreur: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-6">
                        <p>
                            Vous devez être connecté pour utiliser cette page de
                            test.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Page de test - Création de commandes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        Cette page permet de créer une commande de test pour
                        vérifier le système.
                    </p>
                    <p>
                        <strong>Utilisateur connecté :</strong> {user.name} (
                        {user.email})
                    </p>
                    <p>
                        <strong>Token :</strong>{" "}
                        {token ? "Présent" : "Manquant"}
                    </p>

                    <Button
                        onClick={createTestOrder}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading
                            ? "Création en cours..."
                            : "Créer une commande de test"}
                    </Button>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                            Note :
                        </h3>
                        <p className="text-sm text-yellow-700">
                            Cette page est uniquement pour les tests. La
                            commande créée sera factice mais permettra de tester
                            l'affichage dans la page "Mes commandes".
                        </p>
                        <p className="text-sm text-yellow-700 mt-2">
                            <strong>Important :</strong> Maintenant que la route
                            est authentifiée, cette commande sera correctement
                            associée à votre compte.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
