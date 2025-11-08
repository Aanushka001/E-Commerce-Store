const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const checkout = async (customerName, customerEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim()
      })
    });
    
    const data = await handleResponse(response);
    
    // Log the response for debugging
    console.log('Checkout response:', data);
    
    // Ensure the response has the expected structure
    if (!data) {
      throw new Error('No data received from checkout');
    }
    
    return data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
    
  }
};