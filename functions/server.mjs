import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import aiService from './aiService-background.js';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://promptcompare.netlify.app'] // Update this with your Netlify domain
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
};

// Express app setup for local development
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Payment intent endpoint
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

// Compare endpoint (now using background function)
app.post('/api/compare', async (req, res) => {
  try {
    const { models, prompt } = req.body;
    
    if (!models || !Array.isArray(models) || !prompt) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Return 202 Accepted response, processing will happen in background
    res.status(202).json({
      status: 'processing',
      message: 'Your request is being processed',
      statusUrl: '/.netlify/functions/compare-background'
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Start server if running locally
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// For Netlify Functions
export const handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': corsOptions.origin[0],
    'Access-Control-Allow-Methods': corsOptions.methods.join(', '),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  const path = event.path.replace('/.netlify/functions/server', '');
  
  // Parse body for POST requests
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return { 
      statusCode: 400, 
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  // Route the request
  try {
    switch (path) {
      case '/api/health':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            status: 'ok', 
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
          })
        };
      
      case '/api/compare':
        if (event.httpMethod !== 'POST') {
          return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
          };
        }

        if (!body.models || !Array.isArray(body.models) || !body.prompt) {
          return { 
            statusCode: 400, 
            headers,
            body: JSON.stringify({ error: 'Invalid request. Required: models (array) and prompt (string)' })
          };
        }

        // Return 202 Accepted response, processing will happen in background
        return {
          statusCode: 202,
          headers,
          body: JSON.stringify({
            status: 'processing',
            message: 'Your request is being processed',
            statusUrl: '/.netlify/functions/compare-background'
          })
        };
      
      case '/api/create-payment-intent':
        if (event.httpMethod !== 'POST') {
          return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
          };
        }
        
        if (!body.models || !Array.isArray(body.models)) {
          return { 
            statusCode: 400, 
            headers,
            body: JSON.stringify({ error: 'Invalid models data' })
          };
        }

        try {
          // Calculate amount based on number of models (50 cents per model)
          const amount = body.models.length * 50;
          
          const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
              prompt: body.prompt,
              models: JSON.stringify(body.models)
            }
          });

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
          };
          
        } catch (error) {
          console.error('Stripe payment intent creation error:', error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
          };
        }

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Not Found' })
        };
    }
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 