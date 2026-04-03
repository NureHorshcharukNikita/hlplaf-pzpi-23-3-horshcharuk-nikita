import "./App.css";

import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useOrders } from "./hooks/useOrders";
import { useRecommendations } from "./hooks/useRecommendations";

import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Auth from "./components/Auth";
import Recommendations from "./components/Recommendations";

function App() {
  const { token, user, login, register, logout } = useAuth();
  const { cart, setCart, addToCart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { products } = useProducts();
  const { recommendations } = useRecommendations(token);
  const { orders, ordering, checkout, changeStatus } = useOrders(token, cart, setCart);

  if (!token) {
    return <Auth login={login} register={register} />;
  }

  return (
    <div className="page">
      <Header
        logout={logout}
        user={user}
      />

      <main className="layout">
        {user?.role !== "admin" && (
          <>
            <div className="left-column">
              <ProductList
                products={products}
                addToCart={addToCart}
              />

              <Recommendations
                items={recommendations}
                addToCart={addToCart}
              />
            </div>

            <Cart
              cart={cart}
              totalItems={totalItems}
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