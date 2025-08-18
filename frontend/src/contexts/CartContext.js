"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        loadCart();
    }, [user, token]);

    useEffect(() => {
        if (user && token) {
            syncCartWithServer();
        }
    }, [user, token]);

    const loadCart = async () => {
        if (user && token) {
            try {
                const response = await fetch("http://localhost:8000/api/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                } else {
                    console.error("Erreur lors du chargement du panier");
                }
            } catch (error) {
                console.error("Erreur lors du chargement du panier:", error);
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(localCart);
        }
    };

    const syncCartWithServer = async () => {
        if (!user || !token) return;

        const localCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (localCart.length === 0) return;

        try {
            const response = await fetch(
                "http://localhost:8000/api/cart/sync",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ cart: localCart }),
                }
            );

            if (response.ok) {
                const syncedCart = await response.json();
                setCart(syncedCart);
                localStorage.removeItem("cart");
            }
        } catch (error) {
            console.error(
                "Erreur lors de la synchronisation du panier:",
                error
            );
        }
    };

    const addToCart = async (product, quantity = 1) => {
        setLoading(true);

        try {
            if (user && token) {
                const response = await fetch("http://localhost:8000/api/cart", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: quantity,
                    }),
                });

                if (response.ok) {
                    await loadCart();
                    return {
                        success: true,
                        message: "Produit ajouté au panier",
                    };
                } else {
                    const error = await response.json();
                    return { success: false, message: error.error };
                }
            } else {
                const localCart = [...cart];
                
                // Créer un identifiant unique pour le produit avec sa contenance
                const productKey = product.capacity ? `${product.id}-${product.capacity}` : product.id;
                
                const existingItem = localCart.find(
                    (item) => {
                        const itemKey = item.capacity ? `${item.id}-${item.capacity}` : item.id;
                        return itemKey === productKey;
                    }
                );

                if (existingItem) {
                    if (existingItem.quantity + quantity > product.stock) {
                        return {
                            success: false,
                            message: "Stock maximum atteint",
                        };
                    }
                    existingItem.quantity += quantity;
                } else {
                    if (quantity > product.stock) {
                        return { success: false, message: "Stock insuffisant" };
                    }
                    localCart.push({ ...product, quantity });
                }

                setCart(localCart);
                localStorage.setItem("cart", JSON.stringify(localCart));
                return { success: true, message: "Produit ajouté au panier" };
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier:", error);
            return {
                success: false,
                message: "Erreur lors de l'ajout au panier",
            };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        setLoading(true);

        try {
            if (user && token) {
                const response = await fetch(
                    `http://localhost:8000/api/cart/${productId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({ quantity }),
                    }
                );

                if (response.ok) {
                    await loadCart();
                    return { success: true };
                } else {
                    const error = await response.json();
                    return { success: false, message: error.error };
                }
            } else {
                const localCart = cart.map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity: Math.min(
                                  Math.max(quantity, 1),
                                  item.stock
                              ),
                          }
                        : item
                );

                setCart(localCart);
                localStorage.setItem("cart", JSON.stringify(localCart));
                return { success: true };
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            return { success: false, message: "Erreur lors de la mise à jour" };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        setLoading(true);

        try {
            if (user && token) {
                const response = await fetch(
                    `http://localhost:8000/api/cart/${productId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                if (response.ok) {
                    await loadCart();
                }
            } else {
                const localCart = cart.filter((item) => item.id !== productId);
                setCart(localCart);
                localStorage.setItem("cart", JSON.stringify(localCart));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);

        try {
            if (user && token) {
                await fetch("http://localhost:8000/api/cart", {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
            } else {
                localStorage.removeItem("cart");
            }

            setCart([]);
        } catch (error) {
            console.error("Erreur lors du vidage du panier:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCartTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const getCartItemsCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        loadCart,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart doit être utilisé dans un CartProvider");
    }
    return context;
}
