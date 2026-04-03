import React from "react";
import OrderCard from "./OrderCard";

const Orders = React.memo(({ orders, changeStatus, user }) => {
  return (
    <section className="orders-section">
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders">
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              number={orders.length - index}
              changeStatus={changeStatus}
              user={user}
            />
          ))}
        </div>
      )}
    </section>
  );
});

export default Orders;