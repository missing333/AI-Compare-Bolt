import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { handler } from './server.mjs';

// // Get current directory name (needed for ES Modules)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load .env file from the parent directory
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3000;

// Add stripe instance to the request object
app.use((req, res, next) => {
  req.stripe = stripe;
  next();
});

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Wrapper to convert Netlify function handler to Express middleware
const netlifyToExpress = (path) => async (req, res) => {
  console.log('Server-local.js: Making netlifyToExpress call with path:', path);
  const event = {
    path,
    httpMethod: req.method,
    headers: req.headers,
    body: JSON.stringify(req.body),
    queryStringParameters: req.query,
  };

  try {
    const response = await handler(event);
    res.status(response.statusCode)
       .set(response.headers || {})
       .send(response.body ? JSON.parse(response.body) : null);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Routes
app.get('/api/health', netlifyToExpress('/api/health'));
app.post('/api/create-payment-intent', netlifyToExpress('/api/create-payment-intent'));
app.post('/api/compare', netlifyToExpress('/api/compare'));

// Start server
app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
}); 