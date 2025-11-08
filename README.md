# E-Com Shopping Cart

A full-stack e-commerce shopping cart application built with React, Node.js, Express, and MongoDB.

## Features

- Product catalog with grid layout
- Add/remove items from cart
- Update quantities
- Checkout with order receipt
- Responsive design
- MongoDB data persistence

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Installation

### Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/e-commerce
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Server: http://localhost:5000

### Start Frontend
```bash
cd frontend
npm start
```
Client: http://localhost:3000

## API Endpoints

- `GET /api/products` - Get products
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item
- `POST /api/checkout` - Checkout

## Project Structure
```
e-com/
├── backend/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## MongoDB Collections

### Products
```javascript
{
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String
}
```

### Cart
```javascript
{
  userId: String,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: Number
}
```

## Key Components

- **ProductGrid**: Displays products in responsive grid
- **Cart**: Slide-out cart with quantity controls
- **CheckoutForm**: Customer information form
- **ReceiptModal**: Order confirmation receipt

## Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px-1024px (2-3 columns)
- Desktop: > 1024px (4 columns)