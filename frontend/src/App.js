import React, { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import ReceiptModal from './components/ReceiptModal';
import { getProducts, getCart, addToCart, removeFromCart, updateCartItem, checkout } from './services/api';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState({
    products: false,
    cart: false,
    checkout: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please check if the backend server is running.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const loadCart = async () => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      const data = await getCart();
      setCart({
        items: data.items || [],
        total: data.total || 0
      });
      setError(null);
    } catch (err) {
      console.error('Error loading cart:', err);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      await addToCart(productId, 1);
      await loadCart();
      setError(null);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      await removeFromCart(itemId);
      await loadCart();
      setError(null);
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      await updateCartItem(itemId, quantity);
      await loadCart();
      setError(null);
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const handleCheckout = async (formData) => {
    try {
      setLoading(prev => ({ ...prev, checkout: true }));
      
      if (!formData.name?.trim() || !formData.email?.trim()) {
        throw new Error('Please provide both name and email');
      }

      console.log('Sending checkout request...');
      const receiptData = await checkout(formData.name.trim(), formData.email.trim());
      
      console.log('=== RECEIPT DATA FROM BACKEND ===');
      console.log('Full receipt data:', receiptData);
      console.log('Receipt keys:', Object.keys(receiptData || {}));
      console.log('Has items array?', !!receiptData?.items);
      console.log('Items array:', receiptData?.items);
      
      if (receiptData?.items) {
        receiptData.items.forEach((item, index) => {
          console.log(`Item ${index}:`, item);
          console.log(`Item ${index} name:`, item.name);
          console.log(`Item ${index} has name:`, !!item.name);
          console.log(`Item ${index} name length:`, item.name ? item.name.length : 0);
          console.log(`Item ${index} price:`, item.price);
        });
      }

      if (!receiptData) {
        throw new Error('No receipt data received from server');
      }

      const validatedReceipt = {
        orderId: receiptData.orderId || receiptData._id || `order-${Date.now()}`,
        customerName: receiptData.customerName || formData.name.trim(),
        customerEmail: receiptData.customerEmail || formData.email.trim(),
        timestamp: receiptData.timestamp || receiptData.createdAt || new Date().toISOString(),
        items: receiptData.items || [],
        total: receiptData.total || 0
      };

      console.log('=== VALIDATED RECEIPT ===');
      console.log('Validated receipt:', validatedReceipt);
      console.log('Items count:', validatedReceipt.items.length);
      
      validatedReceipt.items.forEach((item, index) => {
        console.log(`Validated item ${index}:`, item);
        console.log(`Validated item ${index} name:`, item.name);
        console.log(`Validated item ${index} has name:`, !!item.name);
      });

      setReceipt(validatedReceipt);
      setShowCheckout(false);
      setShowCart(false);
      await loadCart(); 
      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Checkout failed. Please try again.';
      setError(errorMessage);
      console.error('Error during checkout:', err);
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>E-Commerce Store</h1>
          <div className="header-actions">
            <button 
              className="cart-badge" 
              onClick={toggleCart}
              aria-label={`Shopping cart with ${cartItemsCount} items`}
              disabled={loading.cart}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2L7 4H3v2h2l2 11h10l2-11h2V4h-4l-2-2H9zm0 2h6l1 2H8l1-2zm-3 4h12l-1.5 9H7.5L6 8z"/>
              </svg>
              <span className="cart-count">{cartItemsCount}</span>
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Close error message">×</button>
        </div>
      )}

      <main className="app-main">
        <section className="products-section" aria-labelledby="products-heading">
          <div className="section-header">
            <h2 id="products-heading">Featured Products</h2>
            <p className="section-subtitle">Discover our amazing collection of products</p>
          </div>
          <ProductGrid 
            products={products} 
            onAddToCart={handleAddToCart} 
            loading={loading.products} 
          />
        </section>

        {showCart && (
          <aside className="cart-section" aria-labelledby="cart-heading">
            <Cart 
              cart={cart} 
              total={cart.total} 
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onCheckout={() => setShowCheckout(true)}
              onClose={() => setShowCart(false)}
              loading={loading.cart}
            />
          </aside>
        )}
      </main>

      {showCheckout && (
        <CheckoutForm 
          onSubmit={handleCheckout}
          onClose={() => setShowCheckout(false)}
          loading={loading.checkout}
        />
      )}

      {receipt && (
        <ReceiptModal 
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}

export default App;