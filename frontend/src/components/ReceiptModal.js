import React from 'react';

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  console.log('=== RECEIPT IN MODAL ===');
  console.log('Receipt:', receipt);
  console.log('Items:', receipt.items);
  console.log('Items length:', receipt.items?.length);
  console.log('=====================');

  const items = receipt.items || [];
  const total = receipt.total || 0;
  const orderId = receipt.orderId || receipt._id || 'N/A';
  const customerName = receipt.customerName || receipt.customer?.name || 'N/A';
  const customerEmail = receipt.customerEmail || receipt.customer?.email || 'N/A';
  const timestamp = receipt.timestamp || receipt.createdAt ? 
    new Date(receipt.timestamp || receipt.createdAt).toLocaleString() : 
    new Date().toLocaleString();

  // Calculate total from items if total is 0 but we have items
  const calculatedTotal = total > 0 ? total : items.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const hasItems = items && items.length > 0;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="modal receipt-modal">
        <div className="modal-header">
          <h2 id="receipt-title">Order Receipt</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close receipt">×</button>
        </div>
        <div className="receipt-content">
          <div className="receipt-success">
            <div className="success-icon" aria-hidden="true">✓</div>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for your purchase</p>
          </div>
          
          <div className="receipt-details">
            <h4>Order Information</h4>
            <dl>
              <dt>Order ID:</dt>
              <dd className="order-id">{orderId}</dd>
              <dt>Customer Name:</dt>
              <dd>{customerName}</dd>
              <dt>Email:</dt>
              <dd>{customerEmail}</dd>
              <dt>Order Date:</dt>
              <dd>{timestamp}</dd>
            </dl>
          </div>

          <div className="receipt-items">
            <h4>Order Items</h4>
            {hasItems ? (
              <div className="receipt-items-list">
                {items.map((item, index) => {
                  // Directly use item properties since backend sends proper data
                  const name = item.name || 'Unknown Product';
                  const price = item.price || 0;
                  const quantity = item.quantity || 1;
                  const subtotal = price * quantity;
                  
                  return (
                    <div key={index} className="receipt-item">
                      <div className="receipt-item-info">
                        <span className="item-name">{name}</span>
                        <span className="item-quantity">Quantity: {quantity}</span>
                        <span className="item-price">Price: ${price.toFixed(2)}</span>
                      </div>
                      <span className="item-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-items">
                <p>No items found in this order</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                  This might be a backend issue. Check the console for details.
                </p>
              </div>
            )}
          </div>

          <div className="receipt-total">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${calculatedTotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-actions">
            <button onClick={onClose} className="btn btn-primary btn-large">
              Continue Shopping
            </button>
            <button 
              onClick={() => window.print()} 
              className="btn btn-secondary"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;