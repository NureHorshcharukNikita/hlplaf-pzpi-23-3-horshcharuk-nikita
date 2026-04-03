import { API } from "./config";

export const getProducts = async () => {
  const res = await fetch(`${API}/products`);
  return res.json();
};

export const getRecommendations = async (token) => {
  const res = await fetch(`${API}/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};