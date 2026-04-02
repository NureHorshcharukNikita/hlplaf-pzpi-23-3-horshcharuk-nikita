const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <h3>Order #{order.id}</h3>

      {order.items.map((item) => (
        <div key={item.id} className="order-item">
          {item.name} × {item.quantity} — $
          {item.price * item.quantity}
        </div>
      ))}

      <strong>Total: ${order.total}</strong>
    </div>
  );
};

export default OrderCard;