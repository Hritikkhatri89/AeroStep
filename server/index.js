const express = require('express');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');

const app = express();

// Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in request:', error);
    res.status(500).json({ error: 'Database Connection Failed', details: error.message });
  }
});

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser());

// CORS Middleware - Allow frontend to access backend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// URL normalize middleware for Vercel Serverless Function rewrites
app.use((req, res, next) => {
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '');
    if (!req.url || req.url === '') req.url = '/';
  }
  next();
});

app.get('/', (req, res) => res.send('API Running'));
app.get('/api', (req, res) => res.send('API Running'));

// Define Routes (Supporting both /api/path and /path)
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const reviewsRoute = require('./routes/reviews');
const adminRoute = require('./routes/admin');

app.use('/api/users', usersRoute);
app.use('/users', usersRoute);

app.use('/api/products', productsRoute);
app.use('/products', productsRoute);

app.use('/api/cart', cartRoute);
app.use('/cart', cartRoute);

app.use('/api/orders', ordersRoute);
app.use('/orders', ordersRoute);

app.use('/api/reviews', reviewsRoute);
app.use('/reviews', reviewsRoute);

app.use('/api/admin', adminRoute);
app.use('/admin', adminRoute);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
