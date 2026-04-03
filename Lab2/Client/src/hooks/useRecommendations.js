import { useEffect, useState } from "react";
import { getRecommendations } from "../api/products";

export function useRecommendations(token) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!token) return;

    getRecommendations(token)
      .then(setRecommendations)
      .catch(() => setRecommendations([]));
  }, [token]);

  return { recommendations };
}