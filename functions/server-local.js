import express from 'express';
import cors from 'cors';
import { handler } from './server.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Wrapper to convert Netlify function handler to Express middleware
const netlifyToExpress = (path) => async (req, res) => {
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