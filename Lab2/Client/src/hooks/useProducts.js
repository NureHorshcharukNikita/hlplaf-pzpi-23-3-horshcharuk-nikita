import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../api/products";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadMoreProducts = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getProducts(6, products.length);

      setProducts(prev => [...prev, ...data.items]);
      setTotal(data.total);

    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await getProducts(6, 0);

      setProducts(data.items);
      setTotal(data.total);

      setLoading(false);
    })();
  }, []);

  return {
    products,
    total,
    loading,
    loadMoreProducts
  };
}