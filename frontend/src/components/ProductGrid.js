
function ProductGrid({ products, onAddToCart, loading }) {
  if (loading && products.length === 0) {
    return (
      <div className="product-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="product-card skeleton" style={{ minHeight: '400px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <article key={product._id} className="product-card">
          <div className="product-image-wrapper">
            <img 
              src={product.image} 
              alt={product.name}
              loading="lazy"
              width="400"
              height="400"
            />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <span className="product-category">{product.category}</span>
            <div className="product-footer">
              <span className="product-price" aria-label={`Price: $${(product.price || 0).toFixed(2)}`}>
                ${(product.price || 0).toFixed(2)}
              </span>
              <button 
                onClick={() => onAddToCart(product._id)}
                disabled={loading}
                className="btn btn-primary"
                aria-label={`Add ${product.name} to cart`}
              >
                {loading ? <span className="loading-spinner" /> : 'Add to Cart'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductGrid;