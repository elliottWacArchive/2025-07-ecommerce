"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Users, Shield, User, Info } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                toast.error("Non authentifié - Veuillez vous connecter");
                return;
            }

            console.log(
                "Récupération des utilisateurs avec token:",
                token?.substring(0, 20) + "..."
            );

            const response = await fetch(
                "http://localhost:8000/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Réponse API:", response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Erreur API:", errorData);

                if (response.status === 401) {
                    toast.error("Non autorisé - Token invalide");
                } else if (response.status === 403) {
                    toast.error("Accès refusé - Droits administrateur requis");
                } else if (response.status === 404) {
                    toast.error("Route non trouvée");
                } else {
                    toast.error(
                        `Erreur ${response.status}: ${response.statusText}`
                    );
                }
                return;
            }

            const data = await response.json();
            console.log("Données reçues:", data);
            setUsers(data.users || []);
            toast.success(`${data.users?.length || 0} utilisateurs chargés`);
        } catch (error) {
            console.error("Erreur complète:", error);
            toast.error(`Erreur réseau: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        setUpdating((prev) => ({ ...prev, [userId]: true }));

        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                toast.error("Non authentifié");
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/admin/users/${userId}/role`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role: newRole }),
                }
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du rôle");
            }

            const data = await response.json();

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );

            toast.success("Rôle mis à jour avec succès");
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur lors de la mise à jour du rôle");
        } finally {
            setUpdating((prev) => ({ ...prev, [userId]: false }));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-48 mt-2" />
                        </div>
                        <Skeleton className="h-10 w-32" />
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
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Users className="h-8 w-8" />
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gérez les rôles et permissions des utilisateurs
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <Button
                        variant="outline"
                        onClick={() => {
                            console.log(
                                "Token actuel:",
                                localStorage.getItem("auth_token")
                            );
                            fetchUsers();
                        }}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Recharger
                    </Button>
                    <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {users.length} utilisateurs
                    </Badge>
                </div>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Utilisateurs</CardTitle>
                    <CardDescription>
                        Visualisez et modifiez les rôles des utilisateurs de
                        votre plateforme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-24">Rôle</TableHead>
                                    <TableHead>Date de création</TableHead>
                                    <TableHead className="text-center w-32">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            {user.id}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.role === "admin"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                                className="gap-1"
                                            >
                                                {user.role === "admin" ? (
                                                    <Shield className="h-3 w-3" />
                                                ) : (
                                                    <User className="h-3 w-3" />
                                                )}
                                                {user.role || "user"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("fr-FR")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Select
                                                    value={user.role || "user"}
                                                    onValueChange={(newRole) =>
                                                        updateUserRole(
                                                            user.id,
                                                            newRole
                                                        )
                                                    }
                                                    disabled={updating[user.id]}
                                                >
                                                    <SelectTrigger className="w-24 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-3 w-3" />
                                                                User
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="admin">
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="h-3 w-3" />
                                                                Admin
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {updating[user.id] && (
                                                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold text-foreground">
                                Aucun utilisateur
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Aucun utilisateur trouvé dans la base de
                                données.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Information Alert */}
            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    <div className="space-y-2">
                        <div className="font-medium">
                            Informations sur les rôles :
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>
                                <strong>Admin :</strong> Accès complet à toutes
                                les fonctionnalités d'administration
                            </li>
                            <li>
                                <strong>User :</strong> Accès limité aux
                                fonctionnalités utilisateur standard
                            </li>
                        </ul>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}
