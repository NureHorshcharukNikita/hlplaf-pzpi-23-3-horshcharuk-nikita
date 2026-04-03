import "./App.css";
import { lazy, Suspense } from "react";

import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useOrders } from "./hooks/useOrders";
import { useRecommendations } from "./hooks/useRecommendations";

import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Auth from "./components/Auth";

const Orders = lazy(() => import("./components/Orders"));
const Recommendations = lazy(() => import("./components/Recommendations"));

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

              <Suspense fallback={null}>
                <Recommendations
                  items={recommendations}
                  addToCart={addToCart}
                />
              </Suspense>
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

      <Suspense fallback={null}>
        <Orders
          orders={orders}
          changeStatus={changeStatus}
          user={user}
        />
      </Suspense>
    </div>
  );
}

export default App;