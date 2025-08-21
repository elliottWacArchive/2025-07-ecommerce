"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    Plus,
    Edit,
    Trash2,
    Truck,
    Euro,
    Globe,
    Clock,
    Package,
} from "lucide-react";

export default function AdminShippingPage() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingCosts, setShippingCosts] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingShippingId, setEditingShippingId] = useState(null);
    const [formData, setFormData] = useState({
        country: "",
        delivery_method: "",
        cost: "",
        min_order_amount: "",
        max_order_amount: "",
        estimated_delivery_days: "",
        is_active: true,
    });

    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    const countries = [
        "France",
        "Allemagne",
        "Espagne",
        "Italie",
        "Belgique",
        "Suisse",
        "Canada",
        "Royaume-Uni",
        "Pays-Bas",
        "Portugal",
        "Autriche",
    ];

    const deliveryMethods = [
        "Standard",
        "Express",
        "Chronopost",
        "DHL",
        "UPS",
        "FedEx",
    ];

    const showToast = (message, type = "success") => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user || !token || !isAdmin) {
            router.push("/dashboard");
            return;
        }
    }, [user, token, isAdmin, authLoading, router]);

    useEffect(() => {
        if (token) {
            fetchShippingCosts();
        }
    }, [token]);

    const fetchShippingCosts = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/admin/shipping-costs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setShippingCosts(data);
            } else {
                showToast(
                    "Erreur lors du chargement des frais de port",
                    "error"
                );
            }
        } catch (error) {
            console.error("Erreur:", error);
            showToast("Erreur de connexion", "error");
        }
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setEditingShippingId(null);
        setFormData({
            country: "",
            delivery_method: "",
            cost: "",
            min_order_amount: "",
            max_order_amount: "",
            estimated_delivery_days: "",
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const handleEditShipping = (shipping) => {
        setIsEditMode(true);
        setEditingShippingId(shipping.id);
        setFormData({
            country: shipping.country,
            delivery_method: shipping.delivery_method,
            cost: shipping.cost,
            min_order_amount: shipping.min_order_amount || "",
            max_order_amount: shipping.max_order_amount || "",
            estimated_delivery_days: shipping.estimated_delivery_days || "",
            is_active: shipping.is_active,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingShippingId(null);
    };

    const handleDeleteShipping = async (shippingId) => {
        if (
            !window.confirm(
                "Êtes-vous sûr de vouloir supprimer ce tarif de livraison ?"
            )
        ) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/shipping-costs/${shippingId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                await fetchShippingCosts();
                showToast("Tarif de livraison supprimé avec succès !");
            } else {
                const errorData = await response.json();
                showToast(
                    errorData.message || "Erreur lors de la suppression",
                    "error"
                );
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            showToast("Erreur de connexion lors de la suppression", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditMode
                ? `http://localhost:8000/api/admin/shipping-costs/${editingShippingId}`
                : "http://localhost:8000/api/admin/shipping-costs";

            const method = isEditMode ? "PUT" : "POST";

            const submitData = {
                ...formData,
                cost: parseFloat(formData.cost),
                min_order_amount: formData.min_order_amount
                    ? parseFloat(formData.min_order_amount)
                    : 0,
                max_order_amount: formData.max_order_amount
                    ? parseFloat(formData.max_order_amount)
                    : null,
            };

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (response.ok) {
                const successMessage = isEditMode
                    ? "Tarif de livraison modifié avec succès !"
                    : "Tarif de livraison ajouté avec succès !";
                showToast(successMessage);
                handleCloseModal();
                await fetchShippingCosts();
            } else {
                const errorData = await response.json();
                showToast(
                    errorData.message || "Erreur lors de l'opération",
                    "error"
                );
            }
        } catch (error) {
            console.error("Erreur:", error);
            showToast("Erreur de connexion au serveur", "error");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="container mx-auto p-6">
                <Alert className="max-w-md mx-auto">
                    <AlertDescription>
                        Accès non autorisé. Vous devez être administrateur pour
                        accéder à cette page.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <>
            <AdminHeader title="Frais de port" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-end">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleOpenModal} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Ajouter un tarif
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {isEditMode ? (
                                        <>
                                            <Edit className="h-5 w-5" />
                                            Modifier le tarif de livraison
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-5 w-5" />
                                            Ajouter un tarif de livraison
                                        </>
                                    )}
                                </DialogTitle>
                                <DialogDescription>
                                    {isEditMode
                                        ? "Modifiez les informations du tarif de livraison."
                                        : "Configurez un nouveau tarif de livraison pour un pays et mode de livraison."}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="country"
                                            className="flex items-center gap-2"
                                        >
                                            <Globe className="h-4 w-4" />
                                            Pays *
                                        </Label>
                                        <Select
                                            value={formData.country}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    "country",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un pays" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem
                                                        key={country}
                                                        value={country}
                                                    >
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="delivery_method"
                                            className="flex items-center gap-2"
                                        >
                                            <Truck className="h-4 w-4" />
                                            Mode de livraison *
                                        </Label>
                                        <Select
                                            value={formData.delivery_method}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    "delivery_method",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deliveryMethods.map(
                                                    (method) => (
                                                        <SelectItem
                                                            key={method}
                                                            value={method}
                                                        >
                                                            {method}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="cost"
                                            className="flex items-center gap-2"
                                        >
                                            <Euro className="h-4 w-4" />
                                            Coût de livraison *
                                        </Label>
                                        <Input
                                            type="number"
                                            id="cost"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            required
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="min_order_amount">
                                            Montant minimum (€)
                                        </Label>
                                        <Input
                                            type="number"
                                            id="min_order_amount"
                                            name="min_order_amount"
                                            value={formData.min_order_amount}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="max_order_amount">
                                            Montant maximum (€)
                                        </Label>
                                        <Input
                                            type="number"
                                            id="max_order_amount"
                                            name="max_order_amount"
                                            value={formData.max_order_amount}
                                            onChange={handleChange}
                                            placeholder="Optionnel"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="estimated_delivery_days"
                                        className="flex items-center gap-2"
                                    >
                                        <Clock className="h-4 w-4" />
                                        Délai de livraison estimé
                                    </Label>
                                    <Input
                                        id="estimated_delivery_days"
                                        name="estimated_delivery_days"
                                        value={formData.estimated_delivery_days}
                                        onChange={handleChange}
                                        placeholder="Ex: 3-5 jours, 24h, 1-2 semaines"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                is_active: checked,
                                            })
                                        }
                                    />
                                    <Label htmlFor="is_active">
                                        Tarif actif
                                    </Label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseModal}
                                    >
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {isEditMode
                                                    ? "Modification..."
                                                    : "Ajout..."}
                                            </>
                                        ) : (
                                            <>
                                                {isEditMode ? (
                                                    <>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Modifier
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Ajouter
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Tarifs de livraison ({shippingCosts.length})
                        </h2>
                    </div>

                    {shippingCosts.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-left text-gray-600">
                                    <tr>
                                        <th className="px-4 py-2">Pays</th>
                                        <th className="px-4 py-2">
                                            Mode de livraison
                                        </th>
                                        <th className="px-4 py-2">Coût</th>
                                        <th className="px-4 py-2">
                                            Seuils (€)
                                        </th>
                                        <th className="px-4 py-2">Délai</th>
                                        <th className="px-4 py-2">Statut</th>
                                        <th className="px-4 py-2 text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shippingCosts.map((shipping) => (
                                        <tr
                                            key={shipping.id}
                                            className="border-t"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {shipping.country}
                                            </td>
                                            <td className="px-4 py-2">
                                                {shipping.delivery_method}
                                            </td>
                                            <td className="px-4 py-2">
                                                {shipping.cost}€
                                            </td>
                                            <td className="px-4 py-2">
                                                {shipping.min_order_amount}€
                                                {shipping.max_order_amount &&
                                                    ` - ${shipping.max_order_amount}€`}
                                            </td>
                                            <td className="px-4 py-2">
                                                {shipping.estimated_delivery_days ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Badge
                                                    variant={
                                                        shipping.is_active
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {shipping.is_active
                                                        ? "Actif"
                                                        : "Inactif"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEditShipping(
                                                            shipping
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Modifier
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDeleteShipping(
                                                            shipping.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Supprimer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Card className="p-12">
                            <div className="text-center space-y-3">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold">
                                        Aucun tarif de livraison
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Commencez par ajouter votre premier
                                        tarif de livraison
                                    </p>
                                </div>
                                <Button
                                    onClick={handleOpenModal}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter un tarif
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
