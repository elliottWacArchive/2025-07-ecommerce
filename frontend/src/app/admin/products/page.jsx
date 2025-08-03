"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import {
    Plus,
    Edit,
    Trash2,
    Package,
    Euro,
    Boxes,
    Tag,
    Image,
} from "lucide-react";

export default function AdminProductsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        brand: "",
        category_id: "",
        image: null,
    });

    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    const showToast = (message, type = "success") => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) =>
                console.error("Erreur sur le chargement des produits:", err)
            );
    }, []);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/api/admin/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setCategories(data))
                .catch((err) =>
                    console.error(
                        "Erreur sur le chargement des catégories:",
                        err
                    )
                );
        }
    }, [token]);

    useEffect(() => {
        if (authLoading) return;

        if (!user || !token || !isAdmin) {
            router.push("/dashboard");
            return;
        }
    }, [user, token, isAdmin, authLoading, router]);

    const handleOpenModal = () => {
        setIsEditMode(false);
        setEditingProductId(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            brand: "",
            category_id: "",
            image: null,
        });
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setIsEditMode(true);
        setEditingProductId(product.id);
        setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            brand: product.brand || "",
            category_id: product.category_id || "",
            image: null,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingProductId(null);
        setMessage("");
    };

    const handleDeleteProduct = async (productId) => {
        if (
            !window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")
        ) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const productsResponse = await fetch(
                    "http://localhost:8000/api/products"
                );
                if (productsResponse.ok) {
                    const updatedProducts = await productsResponse.json();
                    setProducts(updatedProducts);
                }
                showToast("Produit supprimé avec succès !");
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
        if (e.target.type === "file") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log("Token utilisé:", token);
        console.log("Données envoyées:", formData);

        try {
            const url = isEditMode
                ? `http://localhost:8000/api/admin/products/${editingProductId}/update`
                : "http://localhost:8000/api/admin/products";

            const submitData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });

            console.log("Statut de la réponse:", response.status);

            if (response.ok) {
                const successMessage = isEditMode
                    ? "Produit modifié avec succès !"
                    : "Produit ajouté avec succès !";
                showToast(successMessage);
                handleCloseModal();

                const productsResponse = await fetch(
                    "http://localhost:8000/api/products"
                );
                if (productsResponse.ok) {
                    const updatedProducts = await productsResponse.json();
                    setProducts(updatedProducts);
                }
            } else {
                const errorText = await response.text();
                console.log("Erreur de réponse:", errorText);
                try {
                    const error = JSON.parse(errorText);
                    showToast(
                        error.message ||
                            `Erreur lors de ${
                                isEditMode ? "la modification" : "l'ajout"
                            } du produit`,
                        "error"
                    );
                } catch {
                    showToast(
                        `Erreur ${response.status}: ${response.statusText}`,
                        "error"
                    );
                }
            }
        } catch (error) {
            console.error("Erreur complète:", error);
            showToast(
                `Erreur de connexion au serveur: ${error.message}`,
                "error"
            );
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-32 w-full mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
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
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Package className="h-8 w-8" />
                        Gestion des produits
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez votre catalogue de produits
                    </p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenModal} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Ajouter un produit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {isEditMode ? (
                                    <>
                                        <Edit className="h-5 w-5" />
                                        Modifier le produit
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5" />
                                        Ajouter un produit
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditMode
                                    ? "Modifiez les informations du produit ci-dessous."
                                    : "Remplissez les informations du nouveau produit."}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nom du produit *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nom du produit"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="brand">Marque</Label>
                                    <Input
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="Marque du produit"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Description du produit"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="price"
                                        className="flex items-center gap-2"
                                    >
                                        <Euro className="h-4 w-4" />
                                        Prix *
                                    </Label>
                                    <Input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="stock"
                                        className="flex items-center gap-2"
                                    >
                                        <Boxes className="h-4 w-4" />
                                        Stock *
                                    </Label>
                                    <Input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="category_id"
                                        className="flex items-center gap-2"
                                    >
                                        <Tag className="h-4 w-4" />
                                        Catégorie
                                    </Label>
                                    <Select
                                        value={formData.category_id.toString()}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                category_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="image"
                                    className="flex items-center gap-2"
                                >
                                    <Image className="h-4 w-4" />
                                    Image
                                </Label>
                                <Input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                {isEditMode &&
                                    products.find(
                                        (p) => p.id === editingProductId
                                    )?.image && (
                                        <div className="mt-2 p-3 border rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Image actuelle :
                                            </p>
                                            <div className="w-24 h-24 relative bg-gray-50 rounded-md border overflow-hidden">
                                                <img
                                                    src={`http://localhost:8000${
                                                        products.find(
                                                            (p) =>
                                                                p.id ===
                                                                editingProductId
                                                        )?.image
                                                    }`}
                                                    alt="Image actuelle"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
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

            {/* Products Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Liste des produits ({products.length})
                    </h2>
                </div>

                {products.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 text-left text-gray-600">
                        <tr>
                          <th className="px-4 py-2">Produit</th>
                          <th className="px-4 py-2">Prix</th>
                          <th className="px-4 py-2">Stock</th>
                          <th className="px-4 py-2">Marque</th>
                          <th className="px-4 py-2">Catégorie</th>
                          <th className="px-4 py-2">Statut</th>
                          <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-t">
                            <td className="px-4 py-3 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Image className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </td>
                            <td className="px-4 py-2">{product.price}€</td>
                            <td className="px-4 py-2">{product.stock}</td>
                            <td className="px-4 py-2">{product.brand || "-"}</td>
                            <td className="px-4 py-2">{product.category?.name || "-"}</td>
                            <td className="px-4 py-2">
                              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                {product.stock > 0 ? "En stock" : "Rupture"}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-right space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
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
                                    Aucun produit
                                </h3>
                                <p className="text-muted-foreground">
                                    Commencez par ajouter votre premier produit
                                </p>
                            </div>
                            <Button onClick={handleOpenModal} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Ajouter un produit
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
