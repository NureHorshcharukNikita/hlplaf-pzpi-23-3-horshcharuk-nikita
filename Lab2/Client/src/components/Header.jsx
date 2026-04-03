import React from "react";

const Header = React.memo(({ logout, user }) => {
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

        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
});

export default Header;