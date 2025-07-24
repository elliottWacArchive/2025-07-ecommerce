// app/cart/page.js
"use client";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, quantity, stock) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(Math.max(quantity, 1), stock) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Votre Panier</h1>
      {cart.length === 0 ? (
        <p>Le panier est vide.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: "20px",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                {item.brand} - {item.name}
              </h3>
              <p>Prix unitaire : {item.price}€</p>
              <label>
                Quantité :
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      parseInt(e.target.value),
                      item.stock
                    )
                  }
                  style={{ marginLeft: "10px", width: "60px" }}
                />
              </label>
              <br />
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 10px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </div>
          ))}
          <h3>Total : {total.toFixed(2)} €</h3>
        </div>
      )}
    </div>
  );
}
