import { useEffect, useState, useCallback } from "react";
import { getOrders, createOrder, updateOrderStatus } from "../api/orders";

export function useOrders(token, cart, setCart) {
  const [orders, setOrders] = useState([]);
  const [ordering, setOrdering] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getOrders(token);
      setOrders(data);
    } catch {
      setOrders([]);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const checkout = useCallback(async () => {
    if (ordering || !token || cart.length === 0) return;

    setOrdering(true);

    try {
      await createOrder(token, cart);
      await fetchOrders();
      setCart([]);
    } finally {
      setOrdering(false);
    }
  }, [ordering, token, cart, setCart, fetchOrders]);

  const changeStatus = useCallback(async (id, status) => {
    await updateOrderStatus(token, id, status);
    await fetchOrders();
  }, [token, fetchOrders]);

  return {
    orders,
    ordering,
    checkout,
    changeStatus
  };
}