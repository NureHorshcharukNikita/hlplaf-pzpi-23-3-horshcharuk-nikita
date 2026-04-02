import { API } from "./config";

export const getProducts = async () => {
  const res = await fetch(`${API}/products`);
  return res.json();
};