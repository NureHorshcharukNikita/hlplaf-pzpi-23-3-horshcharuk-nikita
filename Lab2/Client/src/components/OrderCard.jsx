import React from "react";


const OrderCard = React.memo(({ order, number, changeStatus, user }) => {
  return (
    <div className="order-card">
      <h3>Order #{number}</h3>

      {user?.role === "admin" && (
        <div className="order-user">
          User: {order.userEmail}
        </div>
      )}

      {user?.role !== "admin" && (
        <div className="order-status">
          Status:
            <div className={`status status-${order.status}`}>
              {order.status}
            </div>
        </div>
      )}

      {user?.role === "admin" && (
        <div className="order-actions">
          <span>Status:</span>
          <button
            className={`status-btn pending ${order.status === "pending" ? "active" : ""}`}
            onClick={() => changeStatus(order.id, "pending")}
          >
            Pending
          </button>

          <button
            className={`status-btn processing ${order.status === "processing" ? "active" : ""}`}
            onClick={() => changeStatus(order.id, "processing")}
          >
            Processing
          </button>

          <button
            className={`status-btn shipped ${order.status === "shipped" ? "active" : ""}`}
            onClick={() => changeStatus(order.id, "shipped")}
          >
            Shipped
          </button>

          <button
            className={`status-btn completed ${order.status === "completed" ? "active" : ""}`}
            onClick={() => changeStatus(order.id, "completed")}
          >
            Completed
          </button>
        </div>
      )}

      {order.items.map((item) => (
        <div key={item.productId} className="order-item">
          {item.name} × {item.quantity} — $
          {item.price * item.quantity}
        </div>
      ))}

      <strong>Total: ${order.total}</strong>
    </div>
  );
});

export default OrderCard;