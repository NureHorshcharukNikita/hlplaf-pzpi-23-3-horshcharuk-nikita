import { useEffect, useState } from "react";
import { getOrders, createOrder } from "../api/orders";
import { updateOrderStatus } from "../api/orders";

export function useOrders(token, cart, setCart) {
  const [orders, setOrders] = useState([]);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (!token) return;

    getOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [token]);

  const checkout = async () => {
    if (ordering) return;
    if (!token) return;
    if (cart.length === 0) return;

    setOrdering(true);

    try {
      await createOrder(token, cart);
      const data = await getOrders(token);

      setOrders(data);
      setCart([]);

    } finally {
      setOrdering(false);
    }
  };

  const changeStatus = async (id, status) => {
    await updateOrderStatus(token, id, status);
    const data = await getOrders(token);
    setOrders(data);
  };

  return {
    orders,
    ordering,
    checkout,
    changeStatus
  };
}