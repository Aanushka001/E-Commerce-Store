import express from 'express';
import Product from '../models/Product.js';

// Test function to check product data
const checkProducts = async () => {
  try {
    const products = await Product.find();
    console.log('=== PRODUCT DATA CHECK ===');
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log(`- Name: ${product.name}`);
      console.log(`- Price: ${product.price}`);
      console.log(`- Has name: ${!!product.name}`);
      console.log(`- Name length: ${product.name ? product.name.length : 0}`);
      console.log('---');
    });
    console.log('==========================');
  } catch (error) {
    console.error('Error checking products:', error);
  }
};

// Call this function in your products route
const router = express.Router();

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching products from database...');
    const products = await Product.find();
    
    if (products.length === 0) {
      console.log('No products found in database');
      return res.status(404).json({ 
        message: 'No products found. Please add products to the database.' 
      });
    }

    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error in products route:', error);
    next(error);
  }
});

export default router;