import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

app.get('/', (req, res) => {
  res.json({ message: 'E-Com API is working!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route is working!' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.listen(PORT, () => {
  console.log(`🚀 E-Com Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});