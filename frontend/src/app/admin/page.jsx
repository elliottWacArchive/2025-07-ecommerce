import { AdminHeader } from "@/components/admin-header";

export default function Page() {
    return (
        <>
            <AdminHeader title="Tableau de bord" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="font-semibold">Produits</h3>
                            <p className="text-muted-foreground">
                                Gérer les produits
                            </p>
                        </div>
                    </div>
                    <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="font-semibold">Catégories</h3>
                            <p className="text-muted-foreground">
                                Gérer les catégories
                            </p>
                        </div>
                    </div>
                    <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="font-semibold">Utilisateurs</h3>
                            <p className="text-muted-foreground">
                                Gérer les utilisateurs
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            Bienvenue dans l'administration
                        </h2>
                        <p className="text-muted-foreground">
                            Utilisez la sidebar pour naviguer entre les
                            différentes sections
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
