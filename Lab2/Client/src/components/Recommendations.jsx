import ProductCard from "./ProductCard";

const Recommendations = ({ items, addToCart }) => {
  if (!items.length) return null;

  return (
    <section className="catalog-section">
      <h2>Recommended for you</h2>

      <div className="products">
        {items.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;