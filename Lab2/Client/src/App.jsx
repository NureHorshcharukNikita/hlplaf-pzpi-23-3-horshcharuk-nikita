import "./App.css";
import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

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
      body: JSON.stringify({ items: cart })
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
      <Header totalItems={totalItems} totalPrice={totalPrice} />

      <main className="layout">
        <ProductList
          products={products}
          addToCart={addToCart}
        />

        <Cart
          cart={cart}
          totalPrice={totalPrice}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          checkout={checkout}
        />
      </main>

      <Orders orders={orders} />
    </div>
  );
}

export default App;