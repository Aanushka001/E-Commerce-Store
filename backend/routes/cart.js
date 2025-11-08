import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    console.log('GET /api/cart - Fetching cart...');
    
    let cart = await Cart.findOne({ userId: 'mock-user' });
    
    if (!cart) {
      console.log('No cart found, creating new cart');
      cart = await Cart.create({ userId: 'mock-user', items: [], total: 0 });
    }
    
    // Since we store product data directly in cart items, no need to populate
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log(`Returning cart with ${cart.items.length} items, total: $${total.toFixed(2)}`);
    
    res.json({ 
      items: cart.items,
      total: total 
    });
  } catch (error) {
    console.error('Error in GET /api/cart:', error);
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    console.log(`POST /api/cart - Adding product ${productId}, quantity: ${quantity}`);
    
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      console.error(`Product not found: ${productId}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ userId: 'mock-user' });
    
    if (!cart) {
      console.log('Creating new cart for user');
      cart = new Cart({ userId: 'mock-user', items: [], total: 0 });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      console.log(`Updated existing item quantity to ${cart.items[existingItemIndex].quantity}`);
    } else {
      cart.items.push({ 
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      });
      console.log('Added new item to cart');
    }
    
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Cart updated successfully');
    
    res.json({ 
      items: cart.items,
      total: total 
    });
  } catch (error) {
    console.error('Error in POST /api/cart:', error);
    next(error);
  }
});

// Keep the DELETE and PUT routes as they are (without populate)
router.delete('/:id', async (req, res, next) => {
  try {
    console.log(`DELETE /api/cart/${req.params.id}`);
    
    const cart = await Cart.findOne({ userId: 'mock-user' });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);
    
    if (cart.items.length === originalLength) {
      console.warn('Item not found in cart');
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Item removed from cart successfully');
    
    res.json({ 
      items: cart.items,
      total: total 
    });
  } catch (error) {
    console.error('Error in DELETE /api/cart:', error);
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    console.log(`PUT /api/cart/${req.params.id} - Setting quantity to ${quantity}`);
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    const cart = await Cart.findOne({ userId: 'mock-user' });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item._id.toString() === req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Quantity updated successfully');
    
    res.json({ 
      items: cart.items,
      total: total 
    });
  } catch (error) {
    console.error('Error in PUT /api/cart:', error);
    next(error);
  }
});

export default router;