import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { customerName, customerEmail } = req.body;

    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: 'Customer name and email are required' });
    }

    const cart = await Cart.findOne({ userId: 'mock-user' });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Get fresh product data to ensure we have the latest names
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          name: product ? product.name : item.name,
          price: product ? product.price : item.price,
          image: product ? product.image : item.image,
          quantity: item.quantity
        };
      })
    );

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      userId: 'mock-user',
      items: orderItems,
      total,
      customerName,
      customerEmail,
      timestamp: new Date()
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      orderId: order._id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total,
      timestamp: order.timestamp
    });
  } catch (error) {
    next(error);
  }
});

export default router;