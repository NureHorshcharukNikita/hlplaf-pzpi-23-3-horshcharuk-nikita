import "./App.css";

import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useOrders } from "./hooks/useOrders";

import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Auth from "./components/Auth";

function App() {
  const { token, user, login, register, logout } = useAuth();
  const { cart, setCart, addToCart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { products } = useProducts();
  const { orders, ordering, checkout, changeStatus } = useOrders(token, cart, setCart);

  if (!token) {
    return <Auth login={login} register={register} />;
  }

  return (
    <div className="page">
      <Header
        totalItems={totalItems}
        totalPrice={totalPrice}
        logout={logout}
        user={user}
      />

      <main className="layout">
        {user?.role !== "admin" && (
          <>
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
              ordering={ordering}
            />
          </>
        )}
      </main>

      <Orders
        orders={orders}
        changeStatus={changeStatus}
        user={user}
      />
    </div>
  );
}

export default App;