"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const router = useRouter(); 

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/products/search?name=${encodeURIComponent(q)}`,
          { headers: { Accept: "application/json" }, signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data.slice(0, 8) : [];
        setSuggestions(list);
        setOpen(true);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    onSearch?.(suggestions);
  };

  const pick = (item) => {
    setQuery(item.name);
    setOpen(false);
    // redirection vers la page produit
    router.push(`/products/${item.id}`);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="border border-white rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          style={{ backgroundColor: "#E2E1F9" }}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black border border-black transition"
        >
          Rechercher
        </button>
      </form>

      {open && (
        <ul className="absolute z-50 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-md max-h-80 overflow-auto">
          {loading && <li className="p-3 text-sm text-gray-500">Recherche…</li>}
          {!loading && suggestions.length === 0 && (
            <li className="p-3 text-sm text-gray-500">Aucun résultat</li>
          )}
          {!loading &&
            suggestions.map((item) => (
              <li
                key={item.id}
                onMouseDown={(e) => e.preventDefault()} 
                onClick={() => pick(item)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
              >
                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                  {item.image && (
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `http://localhost:8000${item.image}`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{item.name}</div>
                  {typeof item.price !== "undefined" && (
                    <div className="text-xs text-gray-500">{item.price} €</div>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
