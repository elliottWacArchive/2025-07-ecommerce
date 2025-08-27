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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    RefreshCw,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Download,
} from "lucide-react";

export default function AdminProductsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subSubcategories, setSubSubcategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        brand: "",
        category_id: "",
        subcategory_id: "",
        sub_subcategory_id: "",
        images: [],
    });

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
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

    const sortProducts = (products, key, direction) => {
        return [...products].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            if (aValue === null || aValue === undefined) aValue = "";
            if (bValue === null || bValue === undefined) bValue = "";

            // Gestion des catégories, sous-catégories et sous-sous-catégories (objets avec propriété name)
            if (
                (key === "category" ||
                    key === "subcategory" ||
                    key === "sub_subcategory") &&
                aValue &&
                bValue
            ) {
                aValue = aValue.name || "";
                bValue = bValue.name || "";
            }

            if (key === "price" || key === "stock") {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }

            if (typeof aValue === "string") aValue = aValue.toLowerCase();
            if (typeof bValue === "string") bValue = bValue.toLowerCase();

            if (aValue < bValue) {
                return direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown className="h-4 w-4" />;
        }
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    const handleExportExcel = () => {
        const link = document.createElement("a");
        link.href = "/api/products";
        link.click();
    };

    const sortedProducts = sortProducts(
        products,
        sortConfig.key,
        sortConfig.direction
    );

    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            setSubSubcategories([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/subcategories/by-category?category_id=${categoryId}`
            );
            if (response.ok) {
                const data = await response.json();
                setSubcategories(data);
            }
        } catch (error) {
            console.error(
                "Erreur lors du chargement des sous-catégories:",
                error
            );
        }
    };

    const fetchSubSubcategories = async (subcategoryId) => {
        if (!subcategoryId) {
            setSubSubcategories([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/subsubcategories/by-subcategory?subcategory_id=${subcategoryId}`
            );
            if (response.ok) {
                const data = await response.json();
                setSubSubcategories(data);
            }
        } catch (error) {
            console.error(
                "Erreur lors du chargement des sous-sous-catégories:",
                error
            );
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/products");
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Erreur sur le chargement des produits:", err);
            showToast("Erreur lors du chargement des produits", "error");
        }
    };

    useEffect(() => {
        fetchProducts();
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
            subcategory_id: "",
            sub_subcategory_id: "",
            images: [],
        });
        setSubcategories([]);
        setSubSubcategories([]);
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
            subcategory_id: product.subcategory_id || "",
            sub_subcategory_id: product.sub_subcategory_id || "",
            images: product.images || [],
        });

        if (product.category_id) {
            fetchSubcategories(product.category_id);
        }
        if (product.subcategory_id) {
            fetchSubSubcategories(product.subcategory_id);
        }

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
                await fetchProducts();
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
            const files = Array.from(e.target.files);
            setFormData({
                ...formData,
                images: [...formData.images, ...files],
            });
        } else {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });

            if (name === "category_id") {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    subcategory_id: "",
                    sub_subcategory_id: "",
                }));
                fetchSubcategories(value);
                setSubSubcategories([]);
            } else if (name === "subcategory_id") {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    sub_subcategory_id: "",
                }));
                fetchSubSubcategories(value);
            }
        }
    };

    const handleCategoryChange = (value) => {
        setFormData({
            ...formData,
            category_id: value,
            subcategory_id: "",
            sub_subcategory_id: "",
        });
        fetchSubcategories(value);
        setSubSubcategories([]);
    };

    const handleSubcategoryChange = (value) => {
        const subcategoryId = value === "0" ? "" : value;
        setFormData({
            ...formData,
            subcategory_id: subcategoryId,
            sub_subcategory_id: "",
        });
        if (subcategoryId) {
            fetchSubSubcategories(subcategoryId);
        } else {
            setSubSubcategories([]);
        }
    };

    const handleSubSubcategoryChange = (value) => {
        const subSubcategoryId = value === "0" ? "" : value;
        setFormData({
            ...formData,
            sub_subcategory_id: subSubcategoryId,
        });
    };

    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages,
        });
    };

    const handleImageReorder = (fromIndex, toIndex) => {
        const newImages = [...formData.images];
        const [removed] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, removed);
        setFormData({
            ...formData,
            images: newImages,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const url = isEditMode
                ? `http://localhost:8000/api/admin/products/${editingProductId}/update`
                : "http://localhost:8000/api/admin/products";

            const submitData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    if (key === "images" && formData[key].length > 0) {
                        formData[key].forEach((image, index) => {
                            submitData.append(`images[${index}]`, image);
                        });
                    } else if (key !== "images") {
                        submitData.append(key, formData[key]);
                    }
                }
            });

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });

            if (response.ok) {
                const successMessage = isEditMode
                    ? "Produit modifié avec succès !"
                    : "Produit ajouté avec succès !";
                showToast(successMessage);
                handleCloseModal();
                await fetchProducts();
            } else {
                const errorText = await response.text();
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

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return {
                text: "Stock épuisé",
                variant: "destructive",
            };
        } else if (stock <= 10) {
            return {
                text: "Quantités limitées",
                variant: "secondary",
            };
        } else {
            return {
                text: "En stock",
                variant: "default",
            };
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-4"
                                >
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
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
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Package className="h-8 w-8" />
                        Gestion des Produits
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gérez votre catalogue de produits
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <Button
                        variant="outline"
                        onClick={handleExportExcel}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Télécharger tous les produits (Format Excel)
                    </Button>
                    <Button
                        variant="outline"
                        onClick={fetchProducts}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Recharger
                    </Button>
                    <Badge variant="secondary" className="gap-1">
                        <Package className="h-3 w-3" />
                        {products.length} produits
                    </Badge>
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
                                            Catégorie *
                                        </Label>
                                        <Select
                                            value={formData.category_id.toString()}
                                            onValueChange={handleCategoryChange}
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

                                {formData.category_id && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subcategory_id"
                                                className="flex items-center gap-2"
                                            >
                                                <Tag className="h-4 w-4" />
                                                Sous-catégorie
                                            </Label>
                                            <Select
                                                value={
                                                    formData.subcategory_id
                                                        ? formData.subcategory_id.toString()
                                                        : "0"
                                                }
                                                onValueChange={
                                                    handleSubcategoryChange
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une sous-catégorie" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">
                                                        Aucune sous-catégorie
                                                    </SelectItem>
                                                    {subcategories.map(
                                                        (subcategory) => (
                                                            <SelectItem
                                                                key={
                                                                    subcategory.id
                                                                }
                                                                value={subcategory.id.toString()}
                                                            >
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formData.subcategory_id && (
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="sub_subcategory_id"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Tag className="h-4 w-4" />
                                                    Sous-sous-catégorie
                                                </Label>
                                                <Select
                                                    value={
                                                        formData.sub_subcategory_id
                                                            ? formData.sub_subcategory_id.toString()
                                                            : "0"
                                                    }
                                                    onValueChange={
                                                        handleSubSubcategoryChange
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner une sous-sous-catégorie" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">
                                                            Aucune
                                                            sous-sous-catégorie
                                                        </SelectItem>
                                                        {subSubcategories.map(
                                                            (
                                                                subSubcategory
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        subSubcategory.id
                                                                    }
                                                                    value={subSubcategory.id.toString()}
                                                                >
                                                                    {
                                                                        subSubcategory.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="images"
                                        className="flex items-center gap-2"
                                    >
                                        <Image className="h-4 w-4" />
                                        Images
                                    </Label>
                                    <Input
                                        type="file"
                                        id="images"
                                        name="images"
                                        accept="image/*"
                                        multiple
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Vous pouvez sélectionner plusieurs
                                        images. La première image sera l'image
                                        principale.
                                    </p>

                                    {formData.images.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            <Label className="text-sm font-medium">
                                                Images sélectionnées (
                                                {formData.images.length})
                                            </Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {formData.images.map(
                                                    (image, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative group"
                                                        >
                                                            <div className="w-24 h-24 bg-gray-50 rounded-md border overflow-hidden">
                                                                {image instanceof
                                                                File ? (
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            image
                                                                        )}
                                                                        alt={`Image ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={`http://localhost:8000${image}`}
                                                                        alt={`Image ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>

                                                            {index === 0 && (
                                                                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                                                    Principale
                                                                </div>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveImage(
                                                                        index
                                                                    )
                                                                }
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title="Supprimer cette image"
                                                            >
                                                                ×
                                                            </button>

                                                            {formData.images
                                                                .length > 1 && (
                                                                <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                                                                    {index >
                                                                        0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleImageReorder(
                                                                                    index,
                                                                                    index -
                                                                                        1
                                                                                )
                                                                            }
                                                                            className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            title="Déplacer vers la gauche"
                                                                        >
                                                                            ←
                                                                        </button>
                                                                    )}
                                                                    {index <
                                                                        formData
                                                                            .images
                                                                            .length -
                                                                            1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleImageReorder(
                                                                                    index,
                                                                                    index +
                                                                                        1
                                                                                )
                                                                            }
                                                                            className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            title="Déplacer vers la droite"
                                                                        >
                                                                            →
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {isEditMode &&
                                        products.find(
                                            (p) => p.id === editingProductId
                                        )?.images && (
                                            <div className="mt-4 p-3 border rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Images actuelles :
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {products
                                                        .find(
                                                            (p) =>
                                                                p.id ===
                                                                editingProductId
                                                        )
                                                        ?.images.map(
                                                            (image, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="w-24 h-24 relative bg-gray-50 rounded-md border overflow-hidden"
                                                                >
                                                                    <img
                                                                        src={`http://localhost:8000${image}`}
                                                                        alt={`Image actuelle ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    {index ===
                                                                        0 && (
                                                                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                                                            Principale
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
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
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Produits</CardTitle>
                    <CardDescription>
                        Visualisez et gérez tous vos produits. Cliquez sur les
                        en-têtes de colonnes pour trier.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedProducts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="w-16 cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("id")}
                                    >
                                        <div className="flex items-center gap-2">
                                            ID
                                            {getSortIcon("id")}
                                        </div>
                                    </TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("name")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Nom
                                            {getSortIcon("name")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("brand")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Marque
                                            {getSortIcon("brand")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("price")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Prix
                                            {getSortIcon("price")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("stock")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Stock
                                            {getSortIcon("stock")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("category")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Catégorie
                                            {getSortIcon("category")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            handleSort("subcategory")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            Sous-catégorie
                                            {getSortIcon("subcategory")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            handleSort("sub_subcategory")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            Sous-sous-catégorie
                                            {getSortIcon("sub_subcategory")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center w-32">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedProducts.map((product) => {
                                    const stockStatus = getStockStatus(
                                        product.stock
                                    );
                                    return (
                                        <TableRow
                                            key={product.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {product.id}
                                            </TableCell>
                                            <TableCell>
                                                {product.images &&
                                                product.images.length > 0 ? (
                                                    <div className="flex gap-1">
                                                        {product.images
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    image,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="w-12 h-12 relative bg-gray-50 rounded-md border overflow-hidden"
                                                                    >
                                                                        <img
                                                                            src={`http://localhost:8000${image}`}
                                                                            alt={`${
                                                                                product.name
                                                                            } ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                        {index ===
                                                                            0 && (
                                                                            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-br">
                                                                                P
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        {product.images.length >
                                                            3 && (
                                                            <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-500">
                                                                +
                                                                {product.images
                                                                    .length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                                        <Image className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.brand || "-"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.price}€
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {product.stock}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            stockStatus.variant
                                                        }
                                                    >
                                                        {stockStatus.text}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.category?.name || "-"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.subcategory?.name ||
                                                    "-"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.sub_subcategory
                                                    ?.name || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Modifier
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Supprimer
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold text-foreground">
                                Aucun produit
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Commencez par ajouter votre premier produit
                            </p>
                            <Button
                                onClick={handleOpenModal}
                                className="mt-4 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Ajouter un produit
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
