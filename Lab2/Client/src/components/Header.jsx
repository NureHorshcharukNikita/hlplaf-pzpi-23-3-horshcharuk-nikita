const Header = ({ totalItems, totalPrice, logout, user }) => {
  const isAdmin = user?.role === "admin";

  return (
    <header className="header">
      <h1>
        {isAdmin ? "Admin Panel" : "Product Catalog"}
      </h1>

      <div className="cart-summary">
        <span>
          {user?.email} ({user?.role})
        </span>

        {!isAdmin && (
          <>
            <span>Items: {totalItems}</span>
            <span>Total: ${totalPrice}</span>
          </>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;