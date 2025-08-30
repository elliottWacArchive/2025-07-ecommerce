"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    RefreshCw,
    ShoppingBag,
    MapPin,
    Calendar,
    CreditCard,
    User,
    Search,
} from "lucide-react";
import { toast } from "sonner";

export default function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();

    // Rediriger si l'utilisateur n'est pas connecté
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && token) {
            fetchUserOrders();
        }
    }, [user, token]);

    useEffect(() => {
        let filtered = orders;

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (order) => order.status === statusFilter
            );
        }

        if (searchTerm.trim()) {
            filtered = filtered.filter(
                (order) =>
                    order.id.toString().includes(searchTerm) ||
                    order.customer_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    order.customer_email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (order.items &&
                        order.items.some(
                            (item) =>
                                item.name &&
                                item.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                        ))
            );
        }

        setFilteredOrders(filtered);
    }, [orders, statusFilter, searchTerm]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            console.log(
                "Fetching orders with token:",
                token ? "Token présent" : "Token manquant"
            );

            const response = await fetch(
                "http://localhost:8000/api/user/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("Orders data received:", data);
            setOrders(data.orders || []);
            setFilteredOrders(data.orders || []);

            if (data.orders && data.orders.length === 0) {
                console.log("Aucune commande trouvée pour cet utilisateur");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des commandes:", error);
            toast.error(
                "Erreur lors du chargement de vos commandes: " + error.message
            );
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

    const getStatusInfo = (status) => {
        const statusConfig = {
            pending: {
                label: "En attente",
                variant: "secondary",
                icon: Clock,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                description: "Votre commande est en cours de traitement",
            },
            paid: {
                label: "Payée",
                variant: "success",
                icon: CheckCircle,
                color: "text-green-600",
                bgColor: "bg-green-50",
                description: "Paiement confirmé, commande en préparation",
            },
            shipped: {
                label: "Expédiée",
                variant: "default",
                icon: Truck,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                description: "Votre commande a été expédiée",
            },
            canceled: {
                label: "Annulée",
                variant: "destructive",
                icon: XCircle,
                color: "text-red-600",
                bgColor: "bg-red-50",
                description: "Cette commande a été annulée",
            },
        };

        return statusConfig[status] || statusConfig.pending;
    };

    const handleOrderDetail = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailOpen(true);
    };

    const getOrderProgress = (status) => {
        const steps = ["pending", "paid", "shipped"];
        const currentIndex = steps.indexOf(status);
        return Math.max(0, currentIndex);
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-4"
                                >
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <Alert className="max-w-md mx-auto">
                    <AlertDescription>
                        Vous devez être connecté pour voir vos commandes.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8 space-y-6">
                {process.env.NODE_ENV === "development" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                            Debug Info:
                        </h3>
                        <p>
                            <strong>User:</strong>{" "}
                            {user
                                ? `${user.name} (${user.email})`
                                : "Non connecté"}
                        </p>
                        <p>
                            <strong>Token:</strong>{" "}
                            {token ? "Présent" : "Manquant"}
                        </p>
                        <p>
                            <strong>Loading:</strong> {loading ? "Oui" : "Non"}
                        </p>
                        <p>
                            <strong>Orders count:</strong> {orders.length}
                        </p>
                        <p>
                            <strong>Filtered orders count:</strong>{" "}
                            {filteredOrders.length}
                        </p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                            <ShoppingBag className="h-8 w-8" />
                            Mes Commandes
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Suivez l'état de vos commandes et consultez
                            l'historique
                        </p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par N°, nom, email ou produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-80"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Toutes les commandes
                                </SelectItem>
                                <SelectItem value="pending">
                                    En attente
                                </SelectItem>
                                <SelectItem value="paid">Payées</SelectItem>
                                <SelectItem value="shipped">
                                    Expédiées
                                </SelectItem>
                                <SelectItem value="canceled">
                                    Annulées
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={fetchUserOrders}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Actualiser
                        </Button>
                        <Badge variant="secondary" className="gap-1">
                            <Package className="h-3 w-3" />
                            {filteredOrders.length} commande
                            {filteredOrders.length > 1 ? "s" : ""}
                        </Badge>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {statusFilter === "all"
                                    ? "Aucune commande"
                                    : `Aucune commande ${
                                          statusFilter === "pending"
                                              ? "en attente"
                                              : statusFilter === "paid"
                                              ? "payée"
                                              : statusFilter === "shipped"
                                              ? "expédiée"
                                              : "annulée"
                                      }`}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {statusFilter === "all"
                                    ? "Vous n'avez encore passé aucune commande."
                                    : "Aucune commande ne correspond à ce filtre."}
                            </p>
                            {statusFilter === "all" && (
                                <Button
                                    onClick={() => router.push("/shop")}
                                    className="gap-2"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Commencer mes achats
                                </Button>
                            )}
                            {statusFilter !== "all" && (
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter("all")}
                                    className="gap-2"
                                >
                                    Voir toutes les commandes
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des commandes</CardTitle>
                            <CardDescription>
                                Cliquez sur "Voir détails" pour plus
                                d'informations sur une commande
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-24">
                                            N° Commande
                                        </TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Articles</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="text-center w-32">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => {
                                        const statusInfo = getStatusInfo(
                                            order.status
                                        );
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <TableRow
                                                key={order.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    #{order.id}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`p-1 rounded-full ${statusInfo.bgColor}`}
                                                        >
                                                            <StatusIcon
                                                                className={`h-3 w-3 ${statusInfo.color}`}
                                                            />
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                statusInfo.variant
                                                            }
                                                        >
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.items
                                                        ? `${
                                                              order.items.length
                                                          } article${
                                                              order.items
                                                                  .length > 1
                                                                  ? "s"
                                                                  : ""
                                                          }`
                                                        : "-"}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {parseFloat(
                                                        order.total_price
                                                    ).toFixed(2)}
                                                    €
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOrderDetail(
                                                                order
                                                            )
                                                        }
                                                        className="gap-2"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        Voir détails
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                <Dialog
                    open={isOrderDetailOpen}
                    onOpenChange={setIsOrderDetailOpen}
                >
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Détails de la commande #{selectedOrder?.id}
                            </DialogTitle>
                            <DialogDescription>
                                Informations complètes sur votre commande
                            </DialogDescription>
                        </DialogHeader>

                        {selectedOrder && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Truck className="h-5 w-5" />
                                            Statut de la commande
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {(() => {
                                                const statusInfo =
                                                    getStatusInfo(
                                                        selectedOrder.status
                                                    );
                                                const StatusIcon =
                                                    statusInfo.icon;
                                                return (
                                                    <div
                                                        className={`p-4 rounded-lg ${statusInfo.bgColor} flex items-center gap-3`}
                                                    >
                                                        <StatusIcon
                                                            className={`h-6 w-6 ${statusInfo.color}`}
                                                        />
                                                        <div>
                                                            <div
                                                                className={`font-semibold ${statusInfo.color}`}
                                                            >
                                                                {
                                                                    statusInfo.label
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    statusInfo.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>Commande</span>
                                                    <span>Paiement</span>
                                                    <span>Expédition</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${
                                                                (getOrderProgress(
                                                                    selectedOrder.status
                                                                ) +
                                                                    1) *
                                                                33.33
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                Informations générales
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Date de commande:
                                                </span>
                                                <span className="font-medium">
                                                    {formatDate(
                                                        selectedOrder.created_at
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Sous-total:
                                                </span>
                                                <span className="font-medium">
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
                                                </span>
                                            </div>
                                            {selectedOrder.shipping_cost >
                                                0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Frais de livraison:
                                                    </span>
                                                    <span className="font-medium">
                                                        {parseFloat(
                                                            selectedOrder.shipping_cost
                                                        ).toFixed(2)}
                                                        €
                                                    </span>
                                                </div>
                                            )}
                                            <Separator />
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total:</span>
                                                <span>
                                                    {parseFloat(
                                                        selectedOrder.total_price
                                                    ).toFixed(2)}
                                                    €
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <MapPin className="h-5 w-5" />
                                                Livraison
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <div className="text-muted-foreground text-sm">
                                                    Adresse de livraison:
                                                </div>
                                                <div className="font-medium">
                                                    {selectedOrder.shipping_address ||
                                                        selectedOrder.customer_address ||
                                                        "Non spécifiée"}
                                                </div>
                                            </div>
                                            {selectedOrder.shipping_method && (
                                                <div>
                                                    <div className="text-muted-foreground text-sm">
                                                        Mode de livraison:
                                                    </div>
                                                    <div className="font-medium">
                                                        {
                                                            selectedOrder.shipping_method
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            {selectedOrder.delivery_time && (
                                                <div>
                                                    <div className="text-muted-foreground text-sm">
                                                        Délai de livraison:
                                                    </div>
                                                    <div className="font-medium">
                                                        {
                                                            selectedOrder.delivery_time
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            {selectedOrder.tracking_number && (
                                                <div>
                                                    <div className="text-muted-foreground text-sm">
                                                        Numéro de suivi:
                                                    </div>
                                                    <div className="font-mono text-sm bg-muted p-2 rounded">
                                                        {
                                                            selectedOrder.tracking_number
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {selectedOrder.items &&
                                    selectedOrder.items.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <ShoppingBag className="h-5 w-5" />
                                                    Articles commandés (
                                                    {selectedOrder.items.length}
                                                    )
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Produit
                                                            </TableHead>
                                                            <TableHead className="text-center">
                                                                Quantité
                                                            </TableHead>
                                                            <TableHead className="text-right">
                                                                Prix unitaire
                                                            </TableHead>
                                                            <TableHead className="text-right">
                                                                Total
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedOrder.items.map(
                                                            (item, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            {item.image && (
                                                                                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                                                                                    <img
                                                                                        src={`http://localhost:8000${item.image}`}
                                                                                        alt={
                                                                                            item.name
                                                                                        }
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                            <div>
                                                                                <div className="font-medium">
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </div>
                                                                                {item.brand && (
                                                                                    <div className="text-sm text-muted-foreground">
                                                                                        {
                                                                                            item.brand
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        <Badge variant="outline">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        {parseFloat(
                                                                            item.price
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                        €
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-medium">
                                                                        {(
                                                                            parseFloat(
                                                                                item.price
                                                                            ) *
                                                                            parseInt(
                                                                                item.quantity
                                                                            )
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                        €
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    )}

                                {selectedOrder.payment_intent_id && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                Paiement
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        ID de transaction:
                                                    </span>
                                                    <span className="font-mono text-sm">
                                                        {
                                                            selectedOrder.payment_intent_id
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Statut du paiement:
                                                    </span>
                                                    <Badge variant="success">
                                                        Confirmé
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
