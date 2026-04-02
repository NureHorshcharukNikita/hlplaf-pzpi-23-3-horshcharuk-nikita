import CartItem from "./CartItem";

const Cart = ({ cart, totalPrice, removeFromCart, clearCart, checkout }) => {
  return (
    <aside className="cart-section">
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                removeFromCart={removeFromCart}
              />
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
  );
};

export default Cart;