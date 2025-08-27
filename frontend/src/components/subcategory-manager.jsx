"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Tag,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function SubcategoryManager({ category, token, isOpen, onToggle }) {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSubcategory, setCurrentSubcategory] = useState(null);
    const [formData, setFormData] = useState({ name: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [expandedSubcategories, setExpandedSubcategories] = useState(
        new Set()
    );

    const fetchSubcategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/api/admin/subcategories?category_id=${category.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSubcategories(response.data);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des sous-catégories:",
                error
            );
            toast.error("Erreur lors du chargement des sous-catégories");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchSubcategories();
        }
        onToggle();
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setCurrentSubcategory(null);
        setFormData({ name: "" });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEditSubcategory = (subcategory) => {
        setIsEditMode(true);
        setCurrentSubcategory(subcategory);
        setFormData({ name: subcategory.name });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "" });
        setErrors({});
        setCurrentSubcategory(null);
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
            newErrors.name = "Le nom de la sous-catégorie est requis";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères";
        }

        const existingSubcategory = subcategories.find(
            (sub) =>
                sub.name.toLowerCase() === formData.name.trim().toLowerCase() &&
                (!isEditMode || sub.id !== currentSubcategory.id)
        );

        if (existingSubcategory) {
            newErrors.name = "Cette sous-catégorie existe déjà";
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

            const data = {
                name: formData.name.trim(),
                category_id: category.id,
            };

            if (isEditMode) {
                await axios.put(
                    `http://localhost:8000/api/admin/subcategories/${currentSubcategory.id}`,
                    data,
                    config
                );
                toast.success("Sous-catégorie modifiée avec succès");
            } else {
                await axios.post(
                    "http://localhost:8000/api/admin/subcategories",
                    data,
                    config
                );
                toast.success("Sous-catégorie créée avec succès");
            }

            await fetchSubcategories();
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(
                    isEditMode
                        ? "Erreur lors de la modification de la sous-catégorie"
                        : "Erreur lors de la création de la sous-catégorie"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSubcategory = async (subcategoryId) => {
        if (
            !window.confirm(
                "Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?"
            )
        ) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8000/api/admin/subcategories/${subcategoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Sous-catégorie supprimée avec succès");
            await fetchSubcategories();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            if (error.response?.status === 409) {
                toast.error(
                    "Impossible de supprimer cette sous-catégorie car elle contient des sous-sous-catégories"
                );
            } else {
                toast.error(
                    "Erreur lors de la suppression de la sous-catégorie"
                );
            }
        }
    };

    const toggleSubcategory = (subcategoryId) => {
        const newExpanded = new Set(expandedSubcategories);
        if (newExpanded.has(subcategoryId)) {
            newExpanded.delete(subcategoryId);
        } else {
            newExpanded.add(subcategoryId);
        }
        setExpandedSubcategories(newExpanded);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={handleToggle}>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    {isOpen ? (
                        <ChevronDown className="h-3 w-3" />
                    ) : (
                        <ChevronRight className="h-3 w-3" />
                    )}
                    Sous-catégories ({category.subcategories_count || 0})
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="ml-4 border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                            Sous-catégories de "{category.name}"
                        </h4>
                        <Dialog
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleOpenModal}
                                    className="gap-1 text-xs"
                                >
                                    <Plus className="h-3 w-3" />
                                    Ajouter
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        {isEditMode ? (
                                            <>
                                                <Edit className="h-5 w-5" />
                                                Modifier la sous-catégorie
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                Ajouter une sous-catégorie
                                            </>
                                        )}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {isEditMode
                                            ? "Modifiez le nom de la sous-catégorie ci-dessous."
                                            : `Ajoutez une nouvelle sous-catégorie à "${category.name}".`}
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nom de la sous-catégorie
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Parfums pour femmes..."
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

                    {loading ? (
                        <p className="text-xs text-muted-foreground">
                            Chargement...
                        </p>
                    ) : subcategories.length > 0 ? (
                        <div className="space-y-2">
                            {subcategories.map((subcategory) => (
                                <div
                                    key={subcategory.id}
                                    className="border rounded-lg p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {subcategory.name}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {subcategory.sub_subcategories_count ||
                                                    0}{" "}
                                                sous-sous-catégorie(s)
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEditSubcategory(
                                                        subcategory
                                                    )
                                                }
                                                className="h-6 px-2 text-xs"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDeleteSubcategory(
                                                        subcategory.id
                                                    )
                                                }
                                                className="h-6 px-2 text-xs"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <SubSubcategoryManager
                                        subcategory={subcategory}
                                        token={token}
                                        isOpen={expandedSubcategories.has(
                                            subcategory.id
                                        )}
                                        onToggle={() =>
                                            toggleSubcategory(subcategory.id)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            Aucune sous-catégorie pour cette catégorie
                        </p>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

function SubSubcategoryManager({ subcategory, token, isOpen, onToggle }) {
    const [subSubcategories, setSubSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSubSubcategory, setCurrentSubSubcategory] = useState(null);
    const [formData, setFormData] = useState({ name: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchSubSubcategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/api/admin/subsubcategories?subcategory_id=${subcategory.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSubSubcategories(response.data);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des sous-sous-catégories:",
                error
            );
            toast.error("Erreur lors du chargement des sous-sous-catégories");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchSubSubcategories();
        }
        onToggle();
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setCurrentSubSubcategory(null);
        setFormData({ name: "" });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEditSubSubcategory = (subSubcategory) => {
        setIsEditMode(true);
        setCurrentSubSubcategory(subSubcategory);
        setFormData({ name: subSubcategory.name });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "" });
        setErrors({});
        setCurrentSubSubcategory(null);
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
            newErrors.name = "Le nom de la sous-sous-catégorie est requis";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères";
        }

        const existingSubSubcategory = subSubcategories.find(
            (subSub) =>
                subSub.name.toLowerCase() ===
                    formData.name.trim().toLowerCase() &&
                (!isEditMode || subSub.id !== currentSubSubcategory.id)
        );

        if (existingSubSubcategory) {
            newErrors.name = "Cette sous-sous-catégorie existe déjà";
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

            const data = {
                name: formData.name.trim(),
                subcategory_id: subcategory.id,
            };

            if (isEditMode) {
                await axios.put(
                    `http://localhost:8000/api/admin/subsubcategories/${currentSubSubcategory.id}`,
                    data,
                    config
                );
                toast.success("Sous-sous-catégorie modifiée avec succès");
            } else {
                await axios.post(
                    "http://localhost:8000/api/admin/subsubcategories",
                    data,
                    config
                );
                toast.success("Sous-sous-catégorie créée avec succès");
            }

            await fetchSubSubcategories();
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(
                    isEditMode
                        ? "Erreur lors de la modification de la sous-sous-catégorie"
                        : "Erreur lors de la création de la sous-sous-catégorie"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSubSubcategory = async (subSubcategoryId) => {
        if (
            !window.confirm(
                "Êtes-vous sûr de vouloir supprimer cette sous-sous-catégorie ?"
            )
        ) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8000/api/admin/subsubcategories/${subSubcategoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Sous-sous-catégorie supprimée avec succès");
            await fetchSubSubcategories();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error(
                "Erreur lors de la suppression de la sous-sous-catégorie"
            );
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={handleToggle} className="mt-2">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    {isOpen ? (
                        <ChevronDown className="h-3 w-3" />
                    ) : (
                        <ChevronRight className="h-3 w-3" />
                    )}
                    Sous-sous-catégories (
                    {subcategory.sub_subcategories_count || 0})
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="ml-4 border-l-2 border-gray-100 pl-4">
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-xs font-medium text-gray-600">
                            Sous-sous-catégories de "{subcategory.name}"
                        </h5>
                        <Dialog
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleOpenModal}
                                    className="gap-1 text-xs h-6"
                                >
                                    <Plus className="h-3 w-3" />
                                    Ajouter
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        {isEditMode ? (
                                            <>
                                                <Edit className="h-5 w-5" />
                                                Modifier la sous-sous-catégorie
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                Ajouter une sous-sous-catégorie
                                            </>
                                        )}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {isEditMode
                                            ? "Modifiez le nom de la sous-sous-catégorie ci-dessous."
                                            : `Ajoutez une nouvelle sous-sous-catégorie à "${subcategory.name}".`}
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nom de la sous-sous-catégorie
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Eau de parfum..."
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

                    {loading ? (
                        <p className="text-xs text-muted-foreground">
                            Chargement...
                        </p>
                    ) : subSubcategories.length > 0 ? (
                        <div className="space-y-1">
                            {subSubcategories.map((subSubcategory) => (
                                <div
                                    key={subSubcategory.id}
                                    className="flex items-center justify-between bg-gray-50 rounded p-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs">
                                            {subSubcategory.name}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleEditSubSubcategory(
                                                    subSubcategory
                                                )
                                            }
                                            className="h-5 px-1 text-xs"
                                        >
                                            <Edit className="h-2 w-2" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDeleteSubSubcategory(
                                                    subSubcategory.id
                                                )
                                            }
                                            className="h-5 px-1 text-xs"
                                        >
                                            <Trash2 className="h-2 w-2" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            Aucune sous-sous-catégorie pour cette sous-catégorie
                        </p>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
