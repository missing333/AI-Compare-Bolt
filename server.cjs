require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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
    const { models, prompt } = req.body;
    
    if (!models || !Array.isArray(models) || !prompt) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Here you would typically call your AI services
    // For now, we'll return mock results
    const results = await Promise.all(models.map(async (model) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Format the model name nicely
      const modelName = model.id.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Create a formatted response with clear header
      const formattedResponse = [
        `Here is a mock response to your question "${prompt}" from ${modelName}.`,
        'This would be replaced with actual AI model output in production.'
      ].join('\n');

      return {
        modelId: model.id,
        modelName: modelName,
        version: model.version || 'Latest Version',
        response: formattedResponse,
        latency: Number((Math.random() * 1000).toFixed(2))
      };
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 