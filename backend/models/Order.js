import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, default: 'mock-user' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);