"use client";

import { useState, useEffect } from "react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Tag, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (authLoading) return;

        if (!user || !token || !isAdmin) {
            router.push("/");
            return;
        }
    }, [user, token, isAdmin, authLoading, router]);

    useEffect(() => {
        if (token && isAdmin) {
            fetchCategories();
        }
    }, [token, isAdmin]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:8000/api/admin/categories",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des catégories:", error);
            toast.error("Erreur lors du chargement des catégories");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setCurrentCategory(null);
        setFormData({ name: "" });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setIsEditMode(true);
        setCurrentCategory(category);
        setFormData({ name: category.name });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "" });
        setErrors({});
        setCurrentCategory(null);
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Le nom de la catégorie est requis";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères";
        }

        const existingCategory = categories.find(
            (cat) =>
                cat.name.toLowerCase() === formData.name.trim().toLowerCase() &&
                (!isEditMode || cat.id !== currentCategory.id)
        );

        if (existingCategory) {
            newErrors.name = "Cette catégorie existe déjà";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            if (isEditMode) {
                await axios.put(
                    `http://localhost:8000/api/admin/categories/${currentCategory.id}`,
                    { name: formData.name.trim() },
                    config
                );
                toast.success("Catégorie modifiée avec succès");
            } else {
                await axios.post(
                    "http://localhost:8000/api/admin/categories",
                    { name: formData.name.trim() },
                    config
                );
                toast.success("Catégorie créée avec succès");
            }

            await fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(
                    isEditMode
                        ? "Erreur lors de la modification de la catégorie"
                        : "Erreur lors de la création de la catégorie"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (
            !window.confirm(
                "Êtes-vous sûr de vouloir supprimer cette catégorie ?"
            )
        ) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8000/api/admin/categories/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Catégorie supprimée avec succès");
            await fetchCategories();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            if (error.response?.status === 409) {
                toast.error(
                    "Impossible de supprimer cette catégorie car elle contient des produits"
                );
            } else {
                toast.error("Erreur lors de la suppression de la catégorie");
            }
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="text-center">
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <>
            <AdminHeader title="Catégories" />
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="mb-8">
                    <div className="flex items-center justify-end">
                        <Dialog
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    onClick={handleOpenModal}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter une catégorie
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        {isEditMode ? (
                                            <>
                                                <Edit className="h-5 w-5" />
                                                Modifier la catégorie
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                Ajouter une catégorie
                                            </>
                                        )}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {isEditMode
                                            ? "Modifiez le nom de la catégorie ci-dessous."
                                            : "Ajoutez une nouvelle catégorie à votre catalogue."}
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nom de la catégorie
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Parfums, Maquillage..."
                                            className={
                                                errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCloseModal}
                                            disabled={isSubmitting}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? isEditMode
                                                    ? "Modification..."
                                                    : "Création..."
                                                : isEditMode
                                                ? "Modifier"
                                                : "Créer"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* liste catégories */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Catégories ({categories.length})
                        </CardTitle>
                        <CardDescription>
                            Liste de toutes les catégories de produits
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-4"
                                    >
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[100px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : categories.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Produits</TableHead>
                                            <TableHead>
                                                Date de création
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                                        {category.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {category.products_count ||
                                                            0}{" "}
                                                        produit(s)
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(
                                                        category.created_at
                                                    ).toLocaleDateString(
                                                        "fr-FR"
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleEditCategory(
                                                                    category
                                                                )
                                                            }
                                                            className="gap-1"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDeleteCategory(
                                                                    category.id
                                                                )
                                                            }
                                                            className="gap-1"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold text-foreground">
                                    Aucune catégorie
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    Commencez par créer votre première
                                    catégorie.
                                </p>
                                <Button
                                    onClick={handleOpenModal}
                                    className="mt-4 gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Créer une catégorie
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Note:</strong> La suppression d'une catégorie
                        n'est possible que si elle ne contient aucun produit.
                        Vous devez d'abord déplacer ou supprimer tous les
                        produits de cette catégorie.
                    </AlertDescription>
                </Alert>
            </div>
        </>
    );
}
