import ProductCard from "./ProductCard";

const ProductList = ({ products, total, loading, loadMoreProducts, addToCart }) => {
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

      {products.length < total && (
        <div className="load-more-wrap">
          <button
            className="load-more"
            onClick={loadMoreProducts}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductList;