import { useEffect, useState } from "react";
import { getProducts } from "../api/products";

export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {
        setProducts([
          { id: 0, name: "Error", price: 0, disabled: true }
        ]);
      });
  }, []);

  return { products };
}