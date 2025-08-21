"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

// Configuration de la navigation admin
const navConfig = [
    {
        title: "Tableau de bord",
        url: "/admin",
        items: [
            {
                title: "Vue d'ensemble",
                url: "/admin",
            },
        ],
    },
    {
        title: "Gestion des produits",
        url: "#",
        items: [
            {
                title: "Produits",
                url: "/admin/products",
            },
            {
                title: "Catégories",
                url: "/admin/categories",
            },
        ],
    },
    {
        title: "Gestion des utilisateurs",
        url: "#",
        items: [
            {
                title: "Utilisateurs",
                url: "/admin/users",
            },
        ],
    },
    {
        title: "Livraison",
        url: "#",
        items: [
            {
                title: "Frais de port",
                url: "/admin/shipping",
            },
        ],
    },
];

export function AppSidebar({ ...props }) {
    const pathname = usePathname();

    // Créer les données avec l'état actif basé sur l'URL
    const data = {
        versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
        navMain: navConfig.map((section) => ({
            ...section,
            items: section.items.map((item) => ({
                ...item,
                isActive: pathname === item.url,
            })),
        })),
    };
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <h1 className="text-lg font-semibold text-gray-900">
                    Administration
                </h1>
                {/* <VersionSwitcher
                    versions={data.versions}
                    defaultVersion={data.versions[0]}
                />
                <SearchForm /> */}
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.isActive}
                                        >
                                            <Link href={item.url}>
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
