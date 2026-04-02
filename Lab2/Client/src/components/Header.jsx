const Header = ({ totalItems, totalPrice, logout, user }) => {
  return (
    <header className="header">
      <h1>Product Catalog</h1>

      <div className="cart-summary">
        <span>{user?.email}</span>
        <span>Items: {totalItems}</span>
        <span>Total: ${totalPrice}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;