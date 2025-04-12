import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import aiService from './aiService.js';

// Get current directory name (needed for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// For Netlify Functions
export const handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://promptcompare.netlify.app'
      : 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

      // ... rest of your routes ...
    }
  } catch (error) {
    console.error('Route handling error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 