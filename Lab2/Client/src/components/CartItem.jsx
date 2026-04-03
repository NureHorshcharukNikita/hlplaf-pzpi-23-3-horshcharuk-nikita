import React from "react";

const CartItem = React.memo(({ item, removeFromCart }) => {
  return (
    <div className="cart-item">
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
  );
});

export default CartItem;