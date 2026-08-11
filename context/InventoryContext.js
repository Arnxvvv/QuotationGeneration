"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const InventoryContext = createContext({
  categories: [],
  products: [],
  loading: true,
  error: "",
  refreshCategories: async () => {},
  refreshProducts: async () => {},
  refreshAll: async () => {},
});

export function InventoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([refreshCategories(), refreshProducts()]);
    } catch (err) {
      setError("Failed to load inventory data.");
    } finally {
      setLoading(false);
    }
  }, [refreshCategories, refreshProducts]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <InventoryContext.Provider
      value={{
        categories,
        products,
        loading,
        error,
        refreshCategories,
        refreshProducts,
        refreshAll,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
