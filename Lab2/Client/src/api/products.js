import { API } from "./config";

export const getProducts = async (limit = 6, offset = 0) => {
  const res = await fetch(
    `${API}/products?limit=${limit}&offset=${offset}`
  );
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