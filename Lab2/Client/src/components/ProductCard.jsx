const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price}</p>

      <button
        className="add-btn"
        disabled={product.disabled || product.id === 0}
        onClick={() => addToCart(product)}
      >
        {product.disabled || product.id === 0
          ? "Unavailable"
          : "Add to cart"}
      </button>
    </div>
  );
};

export default ProductCard;