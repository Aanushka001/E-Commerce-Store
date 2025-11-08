import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: 'mock-user' }).populate('productId');
    if (!cart) {
      cart = await Cart.create({ userId: 'mock-user', items: [], total: 0 });
    }

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return { ...item.toObject(), productId: product };
      })
    );

    const total = populatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ items: populatedItems, total: total });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: 'mock-user' });
    if (!cart) {
      cart = new Cart({ userId: 'mock-user', items: [], total: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      });
    }

    await cart.save();

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const productData = await Product.findById(item.productId);
        return { ...item.toObject(), productId: productData };
      })
    );

    const total = populatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ items: populatedItems, total: total });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: 'mock-user' });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return { ...item.toObject(), productId: product };
      })
    );

    const total = populatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ items: populatedItems, total: total });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { quantity } = req.body;

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

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return { ...item.toObject(), productId: product };
      })
    );

    const total = populatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ items: populatedItems, total: total });
  } catch (error) {
    next(error);
  }
});

export default router;
