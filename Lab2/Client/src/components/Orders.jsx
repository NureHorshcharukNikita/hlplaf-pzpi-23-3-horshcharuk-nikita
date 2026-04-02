import OrderCard from "./OrderCard";

const Orders = ({ orders }) => {
  return (
    <section className="orders-section">
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;