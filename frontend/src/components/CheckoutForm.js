import React, { useState } from 'react';

function CheckoutForm({ onSubmit, onClose, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="modal">
        <div className="modal-header">
          <h2 id="checkout-title">Checkout</h2>
          <button 
            onClick={onClose} 
            className="close-btn" 
            aria-label="Close checkout form"
            disabled={loading}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="checkout-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              autoComplete="name"
              disabled={loading}
            />
            {errors.name && (
              <span id="name-error" style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>
                {errors.name}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && (
              <span id="email-error" style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>
                {errors.email}
              </span>
            )}
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-success"
            >
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  <span>Processing...</span>
                </>
              ) : (
                'Complete Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutForm;