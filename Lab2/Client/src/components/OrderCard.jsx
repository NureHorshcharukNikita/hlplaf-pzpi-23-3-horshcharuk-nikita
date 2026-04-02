const OrderCard = ({ order, number }) => {
  return (
    <div className="order-card">
      <h3>Order #{number}</h3>

      {order.items.map((item) => (
        <div key={item.productId} className="order-item">
          {item.name} × {item.quantity} — $
          {item.price * item.quantity}
        </div>
      ))}

      <strong>Total: ${order.total}</strong>
    </div>
  );
};

export default OrderCard;