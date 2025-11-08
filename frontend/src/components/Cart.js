import React from 'react';

function Cart({ cart, total, onRemove, onUpdateQuantity, onCheckout, onClose, loading }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close cart">×</button>
        </div>
        <div className="empty-cart">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 2L7 4H3v2h2l2 11h10l2-11h2V4h-4l-2-2H9zm0 2h6l1 2H8l1-2zm-3 4h12l-1.5 9H7.5L6 8z"/>
          </svg>
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button onClick={onClose} className="close-btn" aria-label="Close cart">×</button>
      </div>
      <div className="cart-items">
        {cart.items.map(item => {
          if (!item.productId) return null;
          
          return (
            <div key={item._id} className="cart-item">
              <img 
                src={item.productId.image || item.image} 
                alt={item.productId.name} 
                loading="lazy" 
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik00MCA0MEM0Mi43NjE0IDQwIDQ1IDM3Ljc2MTQgNDUgMzVDNDUgMzIuMjM4NiA0Mi43NjE0IDMwIDQwIDMwQzM3LjIzODYgMzAgMzUgMzIuMjM4NiAzNSAzNUMzNSAzNy43NjE0IDM3LjIzODYgNDAgNDAgNDBaIiBmaWxsPSIjZDBkMGQwIi8+CjxwYXRoIGQ9Ik00MCA0NUM0Mi43NjE0IDQ1IDQ1IDQyLjc2MTQgNDUgNDBDNDUgMzcuMjM4NiA0Mi43NjE0IDM1IDQwIDM1QzM3LjIzODYgMzUgMzUgMzcuMjM4NiAzNSA0MEMzNSA0Mi43NjE0IDM3LjIzODYgNDUgNDAgNDVaIiBmaWxsPSIjZTBkMGQwIi8+Cjwvc3ZnPgo=';
                }}
              />
              <div className="cart-item-details">
                <h4>{item.productId.name || item.name}</h4>
                <p className="cart-item-price">${(item.productId.price || item.price)?.toFixed(2) || '0.00'}</p>
                <div className="quantity-controls">
                  <button 
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={loading || item.quantity <= 1}
                    className="btn btn-small btn-quantity"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity" aria-label={`Quantity: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    disabled={loading}
                    className="btn btn-small btn-quantity"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => onRemove(item._id)}
                disabled={loading}
                className="btn btn-danger btn-small btn-remove"
                aria-label={`Remove ${item.productId.name || item.name} from cart`}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      <div className="cart-total">
        <h3>Total: <span aria-label={`Total price: $${total?.toFixed(2) || '0.00'}`}>
          ${total?.toFixed(2) || '0.00'}
        </span></h3>
        <button 
          onClick={onCheckout}
          disabled={loading}
          className="btn btn-success btn-large"
          aria-label="Proceed to checkout"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;