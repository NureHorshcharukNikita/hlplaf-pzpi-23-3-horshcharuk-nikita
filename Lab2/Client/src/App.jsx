import "./App.css";
import { useEffect, useMemo, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://192.168.0.77:3000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => {
        setProducts([
          { id: 0, name: "Error", price: 0, disabled: true }
        ]);
      });

    fetch("http://192.168.0.77:3000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.reverse()));
  }, []);

  const addToCart = (product) => {
    if (product.disabled || product.id === 0) return;

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const checkout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    fetch("http://192.168.0.77:3000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: cart
      })
    })
      .then((res) => res.json())
      .then((order) => {
        setOrders((prev) => [order, ...prev]);
        setCart([]);
      })
      .catch(() => {
        alert("Failed to place order");
      });
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Product Catalog</h1>

        <div className="cart-summary">
          <span>Items: {totalItems}</span>
          <span>Total: ${totalPrice}</span>
        </div>
      </header>

      <main className="layout">
        <section className="catalog-section">
          <h2>Products</h2>

          <div className="products">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>

                <button
                  className="add-btn"
                  disabled={product.disabled || product.id === 0}
                  onClick={() => addToCart(product)}
                >
                  {product.disabled || product.id === 0
                    ? "Unavailable"
                    : "Add to cart"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-section">
          <h2>Cart</h2>

          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <h4>{item.name}</h4>
                      <p>
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    <div className="cart-item-right">
                      <strong>
                        ${item.price * item.quantity}
                      </strong>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <p className="cart-total">
                  Total: <strong>${totalPrice}</strong>
                </p>

                <div className="cart-actions">
                  <button
                    className="clear-btn"
                    onClick={clearCart}
                  >
                    Clear cart
                  </button>

                  <button
                    className="checkout-btn"
                    onClick={checkout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
      </main>
      <section className="orders-section">
        <h2>Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="orders">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <h3>Order #{order.id}</h3>

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="order-item"
                  >
                    {item.name} × {item.quantity} — $
                    {item.price * item.quantity}
                  </div>
                ))}

                <strong>Total: ${order.total}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;