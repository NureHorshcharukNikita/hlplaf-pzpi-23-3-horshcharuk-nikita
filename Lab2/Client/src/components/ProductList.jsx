import ProductCard from "./ProductCard";

const ProductList = ({ products, addToCart }) => {
  return (
    <section className="catalog-section">
      <h2>Products</h2>

      <div className="products">
        {products.map((product) => (
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

export default ProductList;