import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://192.168.0.77:3000")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setProducts([
          { id: 0, name: "Error", price: "Failed to load products" }
        ]);
      });
  }, []);

  return (
    <section className="catalog">
      <h2 className="title">Level 1 — Product Catalog</h2>

      <div className="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;