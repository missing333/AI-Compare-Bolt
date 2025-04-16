import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import aiService from './aiService.mjs';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Initialize Stripe with the secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://promptcompare.vercel.app', 'https://ai-compare-bolt.vercel.app', /.vercel\.app$/] // Allow all Vercel domains
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8888'],
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { models, prompt } = req.body;
    
    if (!models || !Array.isArray(models)) {
      return res.status(400).json({ error: 'Invalid models data' });
    }

    // Calculate amount based on number of models
    const amount = models.length * 50; // $0.50 in cents per model

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        prompt,
        models: JSON.stringify(models)
      }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/compare', async (req, res) => {
  try {
    console.log('Received compare request:', req.body);
    const { models, prompt } = req.body;
    
    if (!models || !Array.isArray(models) || !prompt) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    console.log('Making comparison with models:', models);
    const results = await aiService.getComparisonResults(models, prompt);
    console.log('Comparison results:', results);
    res.status(200).json(results);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const server = createServer(app);
  server.listen(port, () => {
    console.log(`Development server running on port ${port}`);
  });
}

// For Vercel Serverless Functions
export default async (req, res) => {
  // Only allow POST and GET methods
  if (!['POST', 'GET'].includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Normalize path handling
  let path = req.url;
  console.log('Original request path:', path);
  
  // Ensure the path starts with /api/
  if (!path.startsWith('/api/') && path !== '/api') {
    path = `/api${path.startsWith('/') ? path : `/${path}`}`;
  }
  
  console.log('Normalized request path:', path);
  
  // Parse body for POST requests
  let body;
  try {
    body = req.body || {};
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Route the request
  try {
    switch (path) {
      case '/api/health':
        return res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
      
      case '/api/create-payment-intent':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method Not Allowed' });
        }
        const { models, prompt } = body;
        
        if (!models || !Array.isArray(models)) {
          return res.status(400).json({ error: 'Invalid models data' });
        }
        
        const amount = models.length * 50;
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          metadata: { prompt, models: JSON.stringify(models) }
        });
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });

      case '/api/compare':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method Not Allowed' });
        }
        
        if (!body.models || !Array.isArray(body.models) || !body.prompt) {
          return res.status(400).json({ error: 'Invalid request data' });
        }
        
        const results = await aiService.getComparisonResults(body.models, body.prompt);
        return res.status(200).json(results);

      default:
        console.log('Path not found:', path);
        return res.status(404).json({ error: 'Not Found', path });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 