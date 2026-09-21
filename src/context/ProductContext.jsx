import { createContext, useContext, useEffect, useState } from "react";
import { loadProducts } from "../api";
import { products as localProducts } from "../data/products";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .catch((error) => setApiError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, setProducts, loading, apiError }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
}
