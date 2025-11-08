import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  image: { 
    type: String, 
    required: true 
  }
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    default: 'mock-user' 
  },
  items: [cartItemSchema],
  total: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

export default mongoose.model('Cart', cartSchema);