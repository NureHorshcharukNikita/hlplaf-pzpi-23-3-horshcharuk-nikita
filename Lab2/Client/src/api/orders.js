import { API } from "./config";

export const getOrders = async (token) => {
  const res = await fetch(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

export const createOrder = async (token, items) => {
  await fetch(`${API}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  });
};

export const updateOrderStatus = async (token, id, status) => {
  await fetch(`${API}/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
};