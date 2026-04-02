const Header = ({ totalItems, totalPrice }) => {
  return (
    <header className="header">
      <h1>Product Catalog</h1>

      <div className="cart-summary">
        <span>Items: {totalItems}</span>
        <span>Total: ${totalPrice}</span>
      </div>
    </header>
  );
};

export default Header;